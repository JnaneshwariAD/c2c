import * as React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
// import { addSemester, deleteSemester, fetchAllCourses, fetchSemesterById, fetchSemesters, updatedSemester } from 'views/API/SemesterApi';

const columns = [
  { id: 'semesterId', label: 'ID' },
  { id: 'semesterName', label: 'Name', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'courseName', label: 'Course Name', minWidth: 150 },
  { id: 'createdBy', label: 'Created By', align: 'right' },
  { id: 'updatedBy', label: 'Updated By', align: 'right' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
  { id: 'updatedDate', label: 'Updated Date', align: 'right' },
  { id: 'actions', label: 'Actions', align: 'right' },
];

const Semester = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userdata, setUserData] = useState({
    semesterName: '',
    description: '',
    courseId: ''
  });
  const [errors, setErrors] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [semesterId, setSemesterId] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };

  const fetchData = async () => {
    try {
      const res = await fetchSemesters(headers);
      const fetchedData = res.data.content;
      if (fetchedData) {
        const tableData = fetchedData.map((p) => ({
          semesterId: p.semesterId,
          semesterName: p.semesterName,
          description: p.description,
          courseName: p.courseDtoList?.map((course) => course.courseName).join(', ') || 'No course',
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy ? p.createdBy.userName : 'No User',
          updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
        }));
        setSemesters(tableData);
      } else {
        setSemesters([]);
      }
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetchAllCourses(headers);
      const fetchedData = res.data;
      if (fetchedData) {
        const sortedData = fetchedData.sort((a, b) => a.courseName.localeCompare(b.courseName));
        const courseData = sortedData.map((c) => ({
          courseId: c.courseId,
          courseName: c.courseName
        }));
        setCourses(courseData);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCourses();
  }, [refreshTrigger]);

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.semesterName || userdata.semesterName.trim() === '') {
      newErrors.semesterName = 'Enter the semester name';
    }

    if (!userdata.description || userdata.description.trim() === '') {
      newErrors.description = 'Enter the description';
    }

    if (!userdata.courseId) {
      newErrors.courseId = 'Select a course';
    }

    return newErrors;
  };

  const changeHandler = (e) => {
    setUserData({
      ...userdata,
      [e.target.name]: e.target.value
    });

    setErrors({
      ...errors,
      [e.target.name]: null
    });
  };

  const handleAddSemester = () => {
    setEditMode(false);
    setUserData({
      semesterName: '',
      description: '',
      courseId: ''
    });
    setOpen(true);
  };

  const postData = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dataToPost = {
      semesterName: userdata.semesterName,
      description: userdata.description,
      courseDtoList: userdata.courseId.map((id) => ({ courseId: id })),
      createdBy: { userId: user.userId }
    };

    try {
      const response = await addSemester(dataToPost, headers);
      if (response.data.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
      } else {
        alert(response.data.errorMessage || 'Failed to add semester.');
      }
    } catch (error) {
      console.error('Error adding semester:', error);
    }
  };

  const handleEdit = async (semesterId) => {
    setEditMode(true);
    setOpen(true);
    try {
      const res = await fetchSemesterById(semesterId, headers);
      const det = res.data;
      setSemesterId(det.semesterId);

      setUserData({
        semesterName: det.semesterName,
        description: det.description,
        courseId: det.courseDtoList ? det.courseDtoList.map((course) => course.courseId) : []
      });
    } catch (error) {
      console.error('Error fetching semester details:', error);
    }
  };

  const updateData = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedDataPayload = {
      semesterId: semesterId,
      semesterName: userdata.semesterName,
      description: userdata.description,
      courseDtoList: userdata.courseId.map((id) => ({ courseId: id })),
      updatedBy: { userId: user.userId }
    };

    try {
      const response = await updatedSemester(updatedDataPayload, headers);
      if (response.data.responseCode === 200) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
      } else {
        alert(response.data.errorMessage);
      }
    } catch (error) {
      console.error('Error updating semester:', error);
    }
  };

  const handleDelete = async (semesterId) => {
    if (window.confirm('Are you sure you want to delete this semester?')) {
      try {
        const response = await deleteSemester(semesterId, headers);
        if (response.data.responseCode === 200) {
          setRefreshTrigger(!refreshTrigger);
        } else {
          alert(response.data.errorMessage);
        }
      } catch (error) {
        console.error('Error deleting semester:', error);
      }
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Semesters</span>
          <Button
            variant="contained"
            color="primary"
            sx={{
              display: 'flex', alignItems: 'center', fontSize: '15px', backgroundColor: "#03045E",
              '&:hover': {
                backgroundColor: "#03045E",
                opacity: 0.9
              }
            }}
            onClick={handleAddSemester}
          >
            Add
            <AddIcon sx={{ color: '#fff' }} />
          </Button>
        </Box>
      }
    >
      <Grid container spacing={gridSpacing}></Grid>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, fontWeight: 600, fontSize: 15 }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {semesters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.semesterId}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{row.semesterName}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.courseName}</TableCell>
                  <TableCell align="right">{row.createdBy}</TableCell>
                  <TableCell align="right">{row.updatedBy}</TableCell>
                  <TableCell align="right">{row.insertedDate}</TableCell>
                  <TableCell align="right">{row.updatedDate}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      sx={{ color: "#03045E" }}
                      onClick={() => handleEdit(row.semesterId)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(row.semesterId)}
                    >
                      <DeleteForever />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={semesters.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Semester' : 'Add Semester'}</DialogTitle>
        <Box component="form" onSubmit={editMode ? updateData : postData} noValidate sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Semester Name"
                name="semesterName"
                value={userdata.semesterName}
                onChange={changeHandler}
                error={!!errors.semesterName}
                helperText={errors.semesterName}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#03045E',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#03045E',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={userdata.description}
                onChange={changeHandler}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#03045E',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#03045E',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.courseId} sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#03045E',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#03045E',
                },
              }}>
                <InputLabel>Courses</InputLabel>
                <Select
                  name="courseId"
                  value={userdata.courseId || []}
                  onChange={(e) =>
                    setUserData({
                      ...userdata,
                      courseId: e.target.value
                    })
                  }
                  multiple
                  renderValue={(selected) =>
                    courses
                      .filter((u) => selected.includes(u.courseId))
                      .map((u) => u.courseName)
                      .join(', ') || 'Select courses'
                  }
                >
                  {courses.map((course) => (
                    <MenuItem key={course.courseId} value={course.courseId}>
                      <Checkbox checked={userdata.courseId?.includes(course.courseId)} />
                      {course.courseName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.courseId && <Box sx={{ color: 'red', fontSize: '0.75rem', mt: 1 }}>{errors.courseId}</Box>}
              </FormControl>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={() => setOpen(false)} sx={{color:"#03045E"}}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ 
              backgroundColor: "#03045E",
              '&:hover': {
                backgroundColor: "#03045E",
                opacity: 0.9
              }
            }}>
              {editMode ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </MainCard>
  );
};

export default Semester;