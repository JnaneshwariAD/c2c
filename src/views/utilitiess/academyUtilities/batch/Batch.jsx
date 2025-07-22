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
import { addBatch, deleteBatch, fetchBatchById, fetchBatches, updatedBatch, fetchAllCourses, fetchAllColleges } from 'views/API/Batchapi';

const columns = [
  { id: 'batchId', label: 'ID' },
  { id: 'batchName', label: 'Name', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'collegeName', label: 'College ', minWidth: 100 },
  { id: 'courseName', label: 'Course ', minWidth: 200 },
  { id: 'createdBy', label: 'Created By', align: 'right' },
  { id: 'updatedBy', label: 'Updated By', align: 'right' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
  { id: 'updatedDate', label: 'Updated Date', align: 'right' },
  { id: 'actions', label: 'Actions', align: 'right' }
];

const Batch = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [courses, setCourses] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [batches, setBatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userdata, setUserData] = useState({
    batchName: '',
    description: '',
    courseId: '',
    collegeId: ''
  });
  const [errors, setErrors] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [batchId, setModuletId] = useState(null);
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
      const res = await fetchBatches(headers);
      const fetchedData = res.data.content;
      if (fetchedData) {
        const tableData = fetchedData.map((p) => ({
          batchId: p.batchId,
          batchName: p.batchName,
          description: p.description,
          courseName: p.courseDtoList?.map((course) => course.courseName).join(', ') || 'No course',
          collegeName: p.collegeDto ? p.collegeDto.collegeName : 'No College Name',
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy ? p.createdBy.userName : 'No User',
          updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
        }));
        setBatches(tableData);
      } else {
        setBatches([]);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
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
  const fetchColleges = async () => {
    try {
      const res = await fetchAllColleges(headers);
      const fetchedData = res.data;
      console.log(res.data);
      if (fetchedData) {
        const sortedData = fetchedData.sort((a, b) => a.collegeName.localeCompare(b.collegeName));
        const collegeData = sortedData.map((c) => ({
          collegeId: c.collegeId,
          collegeName: c.collegeName
        }));
        setColleges(collegeData);
      }
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCourses();
    fetchColleges();
  }, [refreshTrigger]);

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.batchName || userdata.batchName.trim() === '') {
      newErrors.batchName = 'Enter the module name';
    }

    if (!userdata.description || userdata.description.trim() === '') {
      newErrors.description = 'Enter the description';
    }

    if (!userdata.courseId) {
      newErrors.courseId = 'Select a course';
    }
    if (!userdata.collegeId) {
      newErrors.collegeId = 'Select a college';
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

  const handleAddBanner = () => {
    setEditMode(false);
    setUserData({
      batchName: '',
      description: '',
      courseId: '',
      collegeId: ''
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
      batchName: userdata.batchName,
      description: userdata.description,
      courseDtoList: courses
        .filter((course) => course.courseId === userdata.courseId)
        .map((course) => ({
          courseId: course.courseId,
          courseName: course.courseName
        })),
      collegeDto: userdata.collegeId,

      createdBy: { userId: user.userId }
    };

    console.log(dataToPost);

    try {
      const response = await addBatch(dataToPost, headers);
      if (response.data.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
        fetchData();
      } else {
        alert(response.data.errorMessage || 'Failed to add batch.');
      }
    } catch (error) { }
    fetchData();
    setOpen(false);
  };

  const handleEdit = async (batchId) => {
    setEditMode(true);
    setOpen(true);
    try {
      const res = await fetchBatchById(batchId, headers);
      const det = res.data;
      //   console.log(det)

      setUserData({
        batchName: det.batchName,
        description: det.description,
        courseId: det.courseDtoList ? det.courseDtoList.map((course) => course.courseId) : [],
        collegeId: det.collegeDto ? det.collegeDto.collegeId : ''
      });
    } catch (error) {
      console.error('Error fetching batch details:', error);
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
      batchId: batchId,
      batchName: userdata.batchName,
      description: userdata.description,
      //   courseDtoList: courses
      //     .filter((course) => course.courseId === userdata.courseId)
      //     .map((course) => ({
      //       courseId: course.courseId,
      //       courseName: course.courseName
      //     })),
      courseDtoList: userdata.courseId.map((id) => ({ courseId: id })),
      collegeDto: { collegeId: userdata.collegeId },

      updatedBy: { userId: user.userId }
    };

    console.log(updatedDataPayload);

    try {
      const response = await updatedBatch(updatedDataPayload, headers);
      if (response.data.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
        setEditMode(false);
        setModuletId(null);
        setUserData({
          batchName: '',
          description: '',
          courseId: '',
          collegeId: '',
        });
        setSelectedCourses([]);
        fetchData();
      } else {
        alert(response.data.errorMessage);
      }
    } catch (error) { }
    fetchData();
    // setOpen(false);
  };

  const handleDelete = async (batchId) => {
    try {
      await deleteBatch(batchId, headers);
      fetchData();
    } catch (error) {
      console.error('Error deleting batch:', error);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span> Batch</span>
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
            onClick={handleAddBanner}
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
              {batches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.batchId}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'actions' ? (
                        <>
                          <IconButton
                            sx={{ color: "#03045E" }}
                            onClick={() => {
                              handleEdit(row.batchId);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              handleDelete(row.batchId);
                            }}
                          >
                            <DeleteForever />
                          </IconButton>
                        </>
                      ) : (
                        row[column.id] || 'No Data'
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={batches.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Batch' : 'Add Batch'}</DialogTitle>
        <Box component="form" onSubmit={editMode ? updateData : postData} noValidate sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Batch Name"
                name="batchName"
                value={userdata.batchName}
                onChange={changeHandler}
                error={!!errors.batchName}
                helperText={errors.batchName}
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
              <FormControl fullWidth error={!!errors.collegeId} sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#03045E',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#03045E',
                },
              }}>
                <InputLabel>College</InputLabel>
                <Select name="collegeId" value={userdata.collegeId} onChange={changeHandler}>
                  {colleges.map((college) => (
                    <MenuItem key={college.collegeId} value={college.collegeId}>
                      {college.collegeName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.collegeId && <FormHelperText>{errors.collegeId}</FormHelperText>}
              </FormControl>
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
            <Button onClick={() => setOpen(false)} sx={{ color: "#03045E" }}>Cancel</Button>
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

export default Batch;
