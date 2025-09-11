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
  InputLabel,
  FormControl,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Select
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  addBatch,
  deleteBatch,
  fetchBatchById,
  fetchBatches,
  updatedBatch,
  fetchAllCourses,
  fetchAllColleges
} from 'views/API/Batchapi';
import { BaseUrl } from 'BaseUrl';

// ✅ Import BatchCards (make sure this is in a separate file)
import BatchCards from './BatchCards';

const columns = [
  { id: 'batchId', label: 'ID' },
  { id: 'batchName', label: 'Name', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'collegeName', label: 'College ', minWidth: 100 },
  { id: 'courseName', label: 'Course ', minWidth: 100 },
  { id: 'candidatesFileName', label: 'Upload Candidates File', minWidth: 120, align: 'center' },
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
  const [viewMode, setViewMode] = useState('list');
  const [userdata, setUserData] = useState({
    batchName: '',
    description: '',
    courseId: [],
    collegeId: '',
    candidatesFileName: ''
  });
  const [errors, setErrors] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [batchId, setBatchId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

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
        setCourses(sortedData.map((c) => ({ courseId: c.courseId, courseName: c.courseName })));
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchColleges = async () => {
    try {
      const res = await fetchAllColleges(headers);
      const fetchedData = res.data;
      if (fetchedData) {
        const sortedData = fetchedData.sort((a, b) => a.collegeName.localeCompare(b.collegeName));
        setColleges(sortedData.map((c) => ({ collegeId: c.collegeId, collegeName: c.collegeName })));
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
    if (!userdata.batchName || userdata.batchName.trim() === '') newErrors.batchName = 'Enter the batch name';
    if (!userdata.description || userdata.description.trim() === '') newErrors.description = 'Enter the description';
    if (!userdata.courseId || userdata.courseId.length === 0) newErrors.courseId = 'Select a course';
    if (!userdata.collegeId) newErrors.collegeId = 'Select a college';
    return newErrors;
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    if (name === 'courseId') {
      setUserData({ ...userdata, [name]: Array.isArray(value) ? value : [] });
    } else {
      setUserData({ ...userdata, [name]: value });
    }
    setErrors({ ...errors, [name]: null });
  };

  const handleAddBatch = () => {
    setEditMode(false);
    setUserData({ batchName: '', description: '', courseId: [], collegeId: '', candidatesFileName: '' });
    setSelectedFile(null);
    setOpen(true);
  };

  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

 const onFileUpload = async (e) => {
  e.preventDefault();
  if (!selectedFile) {
    Swal.fire({ icon: 'error', title: 'Oops...', text: 'Please select a CSV file!' });
    return;
  }
  
  const data = new FormData();
  data.append('file', selectedFile);
  
  try {
    const res = await axios.post(`${BaseUrl}/file/uploadFile`, data, {
      headers: { 'content-type': 'multipart/form-data', Authorization: 'Bearer ' + user.accessToken }
    });
    
    // Update the state with the correct file name
    setUserData({ ...userdata, candidatesFileName: res.data.fileName });
    
    // Show success message
    Swal.fire({ 
      icon: 'success', 
      title: 'Uploaded!', 
      text: 'File uploaded successfully', 
      timer: 2000, 
      showConfirmButton: false 
    });

    // If in edit mode, update the batch immediately with the new file name
    if (editMode && batchId) {
      const updatedDataPayload = {
        batchId: batchId,
        batchName: userdata.batchName,
        description: userdata.description,
        candidatesFileName: res.data.fileName, // Use the correct file name
        courseDtoList: userdata.courseId.map((id) => ({ courseId: id })),
        collegeDto: { collegeId: userdata.collegeId },
        updatedBy: { userId: user.userId }
      };
      
      await updatedBatch(updatedDataPayload, headers);
      setRefreshTrigger((prev) => !prev);
      
      // Show success message for batch update
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Batch updated with new file',
        timer: 2000,
        showConfirmButton: false
      });
    }
  } catch (error) {
    console.error(error);
    Swal.fire({ 
      icon: 'error', 
      title: 'Upload Failed', 
      text: 'There was an error uploading the file' 
    });
  }
};

// Add this function to clear the selected file
// const clearFileInput = () => {
//   setSelectedFile(null);
//   setUserData({ ...userdata, candidatesFileName: '' });
//   if (inputRef.current) {
//     inputRef.current.value = '';
//   }
// };

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
      candidatesFileName: userdata.candidatesFileName,
      courseDtoList: courses
        .filter((course) => userdata.courseId.includes(course.courseId))
        .map((course) => ({
          courseId: course.courseId,
          courseName: course.courseName
        })),
      collegeDto: { collegeId: userdata.collegeId }, // ✅ FIXED
      createdBy: { userId: user.userId }
    };
    try {
      const response = await addBatch(dataToPost, headers);
      if (response && response.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
      } else {
        alert(response.errorMessage || 'Failed to add batch.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (id) => {
    setEditMode(true);
    setOpen(true);
    try {
      const res = await fetchBatchById(id, headers);
      const det = res.data;
      setBatchId(det.batchId);
      setUserData({
        batchName: det.batchName,
        description: det.description,
        courseId: det.courseDtoList ? det.courseDtoList.map((course) => course.courseId) : [],
        collegeId: det.collegeDto ? det.collegeDto.collegeId : '',
        candidatesFileName: det.candidatesFileName || ''
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
      candidatesFileName: userdata.candidatesFileName,
      courseDtoList: userdata.courseId.map((id) => ({ courseId: id })),
      collegeDto: { collegeId: userdata.collegeId }, // ✅ FIXED
      updatedBy: { userId: user.userId }
    };
    try {
      const response = await updatedBatch(updatedDataPayload, headers);
      if (response && response.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
        setEditMode(false);
      } else alert(response.errorMessage);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBatch(id, headers);
      fetchData();
    } catch (error) {
      console.error('Error deleting batch:', error);
    }
  };

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Batch</span>
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
              color="primary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '15px',
                backgroundColor: '#03045E',
                '&:hover': { backgroundColor: '#03045E', opacity: 0.9 }
              }}
              onClick={handleAddBatch}
            >
              Add
              <AddIcon sx={{ color: '#fff' }} />
            </Button>
          </Box>
        </Box>
      }
    >
      {viewMode === 'list' ? (
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
                            <IconButton sx={{ color: '#03045E' }} onClick={() => handleEdit(row.batchId)}>
                              <Edit />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(row.batchId)}>
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
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
          />
        </Paper>
      ) : (
        <BatchCards
          batches={batches}
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
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.collegeId}>
                <InputLabel>College</InputLabel>
                <Select name="collegeId" value={userdata.collegeId} onChange={changeHandler} label="College">
                  {colleges.map((college) => (
                    <MenuItem key={college.collegeId} value={college.collegeId}>
                      {college.collegeName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.collegeId && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 1 }}>{errors.collegeId}</Box>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.courseId}>
                <InputLabel>Course</InputLabel>
                <Select multiple name="courseId" value={userdata.courseId} onChange={changeHandler} label="Course">
                  {courses.map((course) => (
                    <MenuItem key={course.courseId} value={course.courseId}>
                      {course.courseName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.courseId && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 1 }}>{errors.courseId}</Box>}
              </FormControl>
            </Grid>
            {/* <Grid item xs={12}>
              <TextField
                fullWidth
                label="Upload Candidates CSV"
                name="candidatesFileName"
                value={userdata.candidatesFileName}
                disabled
                InputProps={{
                  endAdornment: (
                    <Button variant="contained" color="primary" onClick={onFileUpload} sx={{ backgroundColor: '#03045E', '&:hover': { opacity: 0.9 } }}>
                      Upload
                    </Button>
                  )
                }}
              />
              <input type="file" accept=".csv" onChange={onFileChange} ref={inputRef} style={{ marginTop: 20 }} />
            </Grid> */}

            {/* // Then add a clear button next to the file input in your JSX: */}
<Grid item xs={12}>
  <TextField
    fullWidth
    label="Upload Candidates CSV"
    name="candidatesFileName"
    value={userdata.candidatesFileName}
    disabled
    InputProps={{
      endAdornment: (
        <>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onFileUpload} 
            sx={{ 
              backgroundColor: '#03045E', 
              '&:hover': { opacity: 0.9 },
              mr: 1
            }}
          >
            Upload
          </Button>
          {/* <Button 
            variant="outlined" 
            color="error" 
            onClick={clearFileInput}
          >
            Clear
          </Button> */}
        </>
      )
    }}
  />
  <input 
    type="file" 
    accept=".csv" 
    onChange={onFileChange} 
    ref={inputRef} 
    style={{ marginTop: 20 }} 
  />
</Grid>


          </Grid>
          <DialogActions>
            <Button onClick={() => setOpen(false)} sx={{ color: '#03045E' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" sx={{ backgroundColor: '#03045E', '&:hover': { opacity: 0.9 } }}>
              {editMode ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </MainCard>
  );
};

export default Batch;







// // ...existing code...
// const onFileUpload = async (e) => {
//   e.preventDefault();
//   if (!selectedFile) {
//     Swal.fire({ icon: 'error', title: 'Oops...', text: 'Please select a CSV file!' });
//     return;
//   }
//   const data = new FormData();
//   data.append('file', selectedFile);
//   try {
//     const res = await axios.post(`${BaseUrl}/file/uploadFile`, data, {
//       headers: { 'content-type': 'multipart/form-data', Authorization: 'Bearer ' + user.accessToken }
//     });
//     setUserData({ ...userdata, candidatesFileName: res.data.fileName });
//     Swal.fire({ icon: 'success', title: 'Uploaded!', text: res.data.message || 'File uploaded successfully', timer: 2000, showConfirmButton: false });

//     // If in edit mode, update the batch immediately with the new file name
//     if (editMode && batchId) {
//       const updatedDataPayload = {
//         batchId: batchId,
//         batchName: userdata.batchName,
//         description: userdata.description,
//         candidatesFileName: res.data.fileName,
//         courseDtoList: userdata.courseId.map((id) => ({ courseId: id })),
//         collegeDto: { collegeId: userdata.collegeId },
//         updatedBy: { userId: user.userId }
//       };
//       await updatedBatch(updatedDataPayload, headers);
//       setRefreshTrigger((prev) => !prev);
//     }
//   } catch (error) {
//     console.error(error);
//     Swal.fire({ icon: 'error', title: 'Upload Failed', text: 'There was an error uploading the file' });
//   }
// };
// // ...existing code...