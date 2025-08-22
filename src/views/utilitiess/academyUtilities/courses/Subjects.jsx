// src/views/Subjects/Subjects.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  IconButton,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Swal from 'sweetalert2';
import {
  addSubject,
  deleteSubject,
  fetchSubjects,
  updateSubject
} from 'views/API/SubjectApi';
import { fetchAllCourses } from 'views/API/CoursesApi';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import axios from 'axios';
import { BaseUrl } from 'BaseUrl';

// ✅ Import SubjectCards
import SubjectCards from './SubjectCards';

const Subjects = () => {
  const theme = useTheme();
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [subjectId, setSubjectId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  const [subjectData, setSubjectData] = useState({
    courseId: '',
    subjectName: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchData();
      await fetchCourses();
    };
    fetchInitialData();
  }, [refresh]);

  const fetchCourses = async () => {
    try {
      const res = await fetchAllCourses(headers);
      const fetchedData = res.data;
      if (fetchedData) {
        const sortedData = fetchedData.sort((a, b) =>
          a.courseName.localeCompare(b.courseName)
        );
        setCourses(sortedData);
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load courses', 'error');
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetchSubjects(headers);
      const fetchedData = res?.data?.content || [];

      const tableData = fetchedData.map((p) => ({
        subjectId: p.subjectId,
        subjectName: p.subjectName,
        courseName: p.courseDtoList?.courseName || 'No Course',
        description: p.description,
        insertedDate: moment(p.insertedDate).format('L'),
        updatedDate: moment(p.updatedDate).format('L'),
        createdBy: p.createdBy?.userName || 'No User',
        updatedBy: p.updatedBy?.userName || 'No User'
      }));

      setSubjects(tableData);
    } catch (error) {
      Swal.fire('Error', 'Failed to fetch subjects', 'error');
      setSubjects([]);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You cannot undo this action!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await deleteSubject(id, headers);
        Swal.fire('Deleted!', 'Subject deleted successfully.', 'success');
        setRefresh(!refresh);
      } catch {
        Swal.fire('Error', 'Failed to delete subject.', 'error');
      }
    }
  };

  const handleEdit = (subject) => {
    setSubjectId(subject.subjectId);
    setSubjectData({
      courseId: courses.find((c) => c.courseName === subject.courseName)
        ?.courseId || '',
      subjectName: subject.subjectName,
      description: subject.description
    });
    setEditMode(true);
    setOpen(true);
  };

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Subjects</span>
          <Box display="flex" alignItems="center" gap={1}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, val) => val && setViewMode(val)}
              size="small"
            >
              <ToggleButton value="list">
                <ViewList />
              </ToggleButton>
              <ToggleButton value="card">
                <ViewModule />
              </ToggleButton>
            </ToggleButtonGroup>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ backgroundColor: '#03045E', '&:hover': { opacity: 0.9 } }}
              onClick={() => {
                setEditMode(false);
                setSubjectData({
                  courseId: '',
                  subjectName: '',
                  description: ''
                });
                setErrors({});
                setOpen(true);
              }}
            >
              Add Subject
            </Button>
          </Box>
        </Box>
      }
    >
      {viewMode === 'list' ? (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead >
                <TableRow >
                  <TableCell  style={{   fontWeight: 600, fontSize: 15 }}>ID</TableCell>
                  <TableCell style={{   fontWeight: 600, fontSize: 15 }}>Subject Name</TableCell>
                  <TableCell style={{   fontWeight: 600, fontSize: 15 }} >Course</TableCell>
                  <TableCell style={{   fontWeight: 600, fontSize: 15 }}>Description</TableCell>
                  <TableCell style={{   fontWeight: 600, fontSize: 15 }}>Created By</TableCell>
                  <TableCell style={{   fontWeight: 600, fontSize: 15 }}>Updated By</TableCell>
                  <TableCell style={{   fontWeight: 600, fontSize: 15 }}>Inserted Date</TableCell>
                  <TableCell style={{   fontWeight: 600, fontSize: 15 }}>Updated Date</TableCell>
                  <TableCell style={{   fontWeight: 600, fontSize: 15 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover key={row.subjectId}>
                      <TableCell>{row.subjectId}</TableCell>
                      <TableCell>{row.subjectName}</TableCell>
                      <TableCell>{row.courseName}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.createdBy}</TableCell>
                      <TableCell>{row.updatedBy}</TableCell>
                      <TableCell>{row.insertedDate}</TableCell>
                      <TableCell>{row.updatedDate}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(row)}
                          sx={{ color: '#03045E' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(row.subjectId)}
                          color="error"
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
            component="div"
            count={subjects.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 100]}
          />
        </Paper>
      ) : (
        <SubjectCards
          subjects={subjects}
          page={page}
          rowsPerPage={rowsPerPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
        />
      )}

      {/* ✅ keep your dialog here (form remains unchanged) */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editMode ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
          >
            <FormControl fullWidth>
              <InputLabel id="course-label">Course</InputLabel>
              <Select
                labelId="course-label"
                value={subjectData.courseId}
                label="Course"
                onChange={(e) =>
                  setSubjectData({ ...subjectData, courseId: e.target.value })
                }
                required
              >
                {courses.map((course) => (
                  <MenuItem key={course.courseId} value={course.courseId}>
                    {course.courseName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Subject Name"
              value={subjectData.subjectName}
              onChange={(e) =>
                setSubjectData({ ...subjectData, subjectName: e.target.value })
              }
              required
              fullWidth
            />

            <TextField
              label="Description"
              value={subjectData.description}
              onChange={(e) =>
                setSubjectData({ ...subjectData, description: e.target.value })
              }
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              // Basic validation
              if (!subjectData.courseId || !subjectData.subjectName) {
                setErrors({ form: 'Course and Subject Name are required.' });
                return;
              }
              try {
                if (editMode) {
                  await updateSubject(
                    { subjectId, ...subjectData },
                    headers
                  );
                } else {
                  await addSubject(subjectData, headers);
                }
                setOpen(false);
                setRefresh((r) => !r);
              } catch (e) {
                // Error handled in API
              }
            }}
          >
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default Subjects;
