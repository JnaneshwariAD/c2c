import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
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
   LinearProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Swal from 'sweetalert2';
import {
   addSubject, 
  deleteSubject, 
  fetchSubjects, 
  updateSubject 
} 
from 'views/API/SubjectApi';
import { BaseUrl } from 'BaseUrl';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import axios from 'axios';

const columns = [
  { id: 'subjectId', label: 'ID' },
  { id: 'subjectName', label: 'Subject Name' },
  { id: 'description', label: 'Description' },
   { id: 'semester', label: 'Semester' },

    { id: 'url', label: 'Url' },
  { id: 'videoUrl', label: 'VideoUrl' },
  { id: 'file', label: 'File', minWidth: 200 },
{ id: 'createdBy', label: 'Created By', align: 'right' },
  { id: 'updatedBy', label: 'Updated By', align: 'right' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
  { id: 'updatedDate', label: 'Updated Date', align: 'right' },
  { id: 'actions', label: 'Actions', align: 'right' }
];

const Subjects = () => {
    const theme = useTheme();
  
  const [subjects, setSubjects] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
    
  
  // const [subjectData, setSubjectData] = useState({ 
  //   subjectName: '', 
  //   description: '' ,
  //   videoUrl: '',
  //   url: '',
  //   fileName: '',
  //   filePath: null,
  //   semester: [],
  // });
   const [userdata, setUserData] = useState({
      subjectName: '',
      description: '',
      videoUrl: '',
    url: '',
    fileName: '',
    filePath: null,
    semester: [],
    });
  const [errors, setErrors] = useState({});
  const [subjectId, setSubjectId] = useState(null);
  const [refresh, setRefresh] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
  
  const inputRef = useRef(null);

     const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

  const handleChangePage = (e, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };

//   const fetchData = async () => {
//   try {
//     const res = await fetchSubjects(headers);
//     if (!res || !res.data) {
//       throw new Error("Invalid API response");
//     }

//     const fetchedData = res.data.content || [];
//     const tableData = fetchedData.map((p) => ({
//       subjectId: p.subjectId,
//       subjectName: p.subjectName,
//       description: p.description,
//       semester: p.semester,
//       videoUrl: p.videoUrl || '',
//       url: p.url || '',
//       fileName: p.fileName || '',
//       file: p.filePath === null ? (
//         'NO FILE FOUND'
//       ) : (
//         <img
//           src={ImageUrl + p.filePath}
//           alt={p.fileName}
//           style={{ width: 100, height: 50 }}
//         />
//       ),
//       insertedDate: moment(p.insertedDate).format('L'),
//       updatedDate: moment(p.updatedDate).format('L'),
//       createdBy: p.createdBy ? p.createdBy.userName : 'No User',
//       updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
//     }));

//     setSubjects(tableData);
//   } 
//   catch (err) {
//     console.error('Error fetching subjects:', err);
//     Swal.fire({
//       icon: 'error',
//       title: 'Error',
//       text: 'Failed to fetch subjects',
//       confirmButtonColor: theme.palette.primary.main
//     });
//     setSubjects([]);
//   }
// };

//  const FetchData = async () => {
//     try {
//       const res = await fetchCourses(headers);
//       const fetchedData = res.data.content;
//       // console.log(fetchedData);
//       if (fetchedData) {
//         const tableData = fetchedData.map((p) => ({
//           courseId: p.courseId,
//           courseName: p.courseName,
//           description: p.description,
//           // courseMrp: p.courseMrp,
//           // discount: p.discount,
//           // gst: p.gst,
//           // gstAmount: p.gstAmount,
//           // sellingPrice: p.sellingPrice,
//           activePeriod: p.activePeriod,
//           trailPeriod: p.trailPeriod,
//           semester: p.semester,
//           categoryName: p.courseCategoryDto ? p.courseCategoryDto.categoryName : 'No Category',
//           universityName: p.universityDtoList ? p.universityDtoList.universityName : 'No university',
//           // branchName: p.branchDtoList ? p.branchDtoList.branchName : 'No branch',
//           videoUrl: p.videoUrl,
//           insertedDate: moment(p.insertedDate).format('L'),
//           updatedDate: moment(p.updatedDate).format('L'),
//           createdBy: p.createdBy ? p.createdBy.userName : 'No User',
//           updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
//         }));
//         setCourses(tableData);
//       } else {
//         setCourses([]);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

const fetchData = async () => {
  try {
    const res = await fetchSubjects(headers);
    const fetchedData = res?.data?.content;

    if (fetchedData && Array.isArray(fetchedData)) {
      const tableData = fetchedData.map((p) => ({
        subjectId: p.subjectId,
        subjectName: p.subjectName,
        description: p.description,
        semester: p.semester,
        videoUrl: p.videoUrl || '',
        url: p.url || '',
        fileName: p.fileName || '',
        file: p.filePath
          ? (
            <img
              src={ImageUrl + p.filePath}
              alt={p.fileName}
              style={{ width: 100, height: 50 }}
            />
          )
          : 'NO FILE FOUND',
        insertedDate: moment(p.insertedDate).format('L'),
        updatedDate: moment(p.updatedDate).format('L'),
        createdBy: p.createdBy?.userName || 'No User',
        updatedBy: p.updatedBy?.userName || 'No User',
      }));

      setSubjects(tableData);
      console.log('Fetched subjects:', fetchedData);
    } else {
      setSubjects([]);
    }
  } catch (error) {
    console.error('Error fetching subjects:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to fetch subjects',
      confirmButtonColor: theme.palette.primary.main
    });
    setSubjects([]);
  }
};


  

  const fileUploadHeaders = {
    'Content-Type': 'multipart/form-data',
    Authorization: 'Bearer ' + user.accessToken
  };

 

  useEffect(() => {
    fetchData();
  }, [refresh]);

  
const validate = () => {
  const newErrors = {};
  if (!userdata.subjectName.trim()) newErrors.subjectName = 'Enter subject name';
  if (!userdata.description.trim()) newErrors.description = 'Enter description';
  if (!userdata.semester || 
      (Array.isArray(userdata.semester) && userdata.semester.length === 0) || 
      (typeof userdata.semester === 'string' && userdata.semester.trim() === '')) {
    newErrors.semester = 'Select at least one semester';
  }
  return newErrors;
};

 
  const postData = async (e) => {
      e.preventDefault();
  
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
  
      const dataToPost = {
        subjectName: userdata.subjectName,
        description: userdata.description,
        semester: userdata.semester,
        videoUrl: userdata.videoUrl,
        courseCategoryDto: { categoryId: userdata.categoryId },
        createdBy: { userId: user.userId }
      };
  
      console.log(dataToPost);
  
      try {
        const response = await addCourse(dataToPost, headers);
        if (response.data.responseCode === 201) {
          setRefreshTrigger(!refreshTrigger);
          setOpen(false);
          fetchData();
        } else {
          alert(response.data.errorMessage || 'Failed to add course.');
        }
      } catch (error) { }
      fetchData();
      setOpen(false);
    };
  
 
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   const validation = validate();
//   if (Object.keys(validation).length) return setErrors(validation);

//   const userInfo = {
//     fullName: user.fullName || '',
//     mobileNumber: user.mobileNumber || '',
//     userId: user.userId || 0,
//     userName: user.userName || '',
//     semester: user.semester || ''
//   };

//   const currentTime = new Date().toISOString();

//   const payload = {
//     subjectName: userdata.subjectName,
//     description: userdata.description,
//     semester : userdata.semester,
//     ...(editMode
//       ? {
//           subjectId,
//           updatedBy: userInfo,
//           updatedDate: currentTime
//         }
//       : {
//           createdBy: userInfo,
//           insertedDate: currentTime
//         })
//   };

//   try {
//     if (editMode) {
//       const res = await updateSubject(payload, headers);
//       if (res?.data?.responseCode === 200) {
//         Swal.fire('Updated!', res.data.message || 'Subject updated successfully.', 'success');
//       } else {
//         throw new Error(res?.data?.errorMessage || 'Update failed');
//       }
//     } else {
//       const res = await addSubject(payload, headers);
//       if (res?.data?.responseCode === 201) {
//         Swal.fire('Added!', res.data.message || 'Subject added successfully.', 'success');
//       } else {
//         throw new Error(res?.data?.errorMessage || 'Add failed');
//       }
//     }

//     setOpen(false);
//     setUserData({ subjectName: '', description: '' });
//     setErrors({});
//     setRefresh(!refresh);
//   } catch (err) {
//     console.error('Submit Error:', err?.response || err);
//     Swal.fire('Error', err.message || 'Operation failed', 'error');
//   }
// };

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
 

    const onFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
          setSelectedFile(e.target.files[0]);
          setUserData({
            ...userdata,
            fileName: e.target.files[0].name
          });
        }
      };
    
      const onFileUpload = async (e) => {
  e.preventDefault();
  if (!selectedFile) {
    Swal.fire({
      icon: 'error',
      title: 'No file selected',
      text: 'Please select a file to upload',
      confirmButtonColor: theme.palette.primary.main
    });
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile);

  try {
    setIsUploading(true);
    Swal.fire({
      title: 'Uploading file...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const res = await axios.post(`${BaseUrl}/file/uploadFile`, formData, {
      headers: fileUploadHeaders,
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      }
    });

    Swal.close();

    if (res.status === 200) {
      setUserData((prev) => ({
        ...prev,
        fileName: res.data.fileName,
        filePath: res.data.filePath
      }));
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'File uploaded successfully',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      throw new Error(res.data.errorMessage || 'File upload failed');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    Swal.fire({
      icon: 'error',
      title: 'Upload error',
      text: error.message || 'An error occurred while uploading the file',
      confirmButtonColor: theme.palette.primary.main
    });
  } finally {
    setIsUploading(false);
    setUploadProgress(0);
  }
};


       const handleCloseDialog = () => {
    setOpen(false);
    setSelectedFile(null);
    setUserData({
      subjectName: '',
      description: '',
      courseId: [],
      videoUrl: '',
      url: '',
      fileName: '',
      filePath: null,
      semester: [],
    });
    setErrors({});
  };


//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   const validation = validate();
//   if (Object.keys(validation).length) return setErrors(validation);

//   const payload = {
//     subjectName: userdata.subjectName,
//     description: userdata.description
//   };

//   try {
//     if (editMode) {
//       const res = await updateSubject({ ...payload, subjectId }, headers);
//       if (res?.data?.responseCode === 200) {
//         Swal.fire('Updated!', 'Subject updated successfully.', 'success');
//       } else {
//         throw new Error(res?.data?.errorMessage || "Update failed");
//       }
//     } else {
//       const res = await addSubject(payload, headers);
//       if (res?.data?.responseCode === 201) {
//         Swal.fire('Added!', 'Subject added successfully.', 'success');
//       } else {
//         throw new Error(res?.data?.errorMessage || "Add failed");
//       }
//     }

//     setOpen(false);
//     setUserData({ subjectName: '', description: '' });
//     setErrors({});
//     setRefresh(!refresh);

//   } catch (err) {
//     Swal.fire('Error', err.message || 'Operation failed', 'error');
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate form
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  try {
    const userInfo = {
      userId: user.userId,
      userName: user.userName
    };

    const payload = {
      subjectName: userdata.subjectName,
      description: userdata.description,
      url: userdata.url || null,
      videoUrl: userdata.videoUrl || null,
      fileName: userdata.fileName || null,
      filePath: userdata.filePath || null,
      semester: Array.isArray(userdata.semester) ? userdata.semester : [userdata.semester],
      ...(editMode ? {
        subjectId: subjectId,
        updatedBy: userInfo,
        updatedDate: new Date().toISOString()
      } : {
        createdBy: userInfo,
        insertedDate: new Date().toISOString()
      })
    };

    console.log('Submitting payload:', payload); // For debugging

    let response;
    if (editMode) {
      response = await updateSubject(payload, headers);
    } else {
      response = await addSubject(payload, headers);
    }
    console.log('API response:', response);

    if (response?.data?.responseCode === (editMode ? 200 : 201)) {
      Swal.fire({
        icon: 'success',
        title: editMode ? 'Updated!' : 'Added!',
        text: response.data.message || `Subject ${editMode ? 'updated' : 'added'} successfully`,
        confirmButtonColor: '#03045E'
      });
      setRefresh(!refresh);
      setOpen(false);
      setUserData({
        subjectName: '',
        description: '',
        url: '',
        videoUrl: '',
        fileName: '',
        filePath: null,
        semester: []
      });
      setSelectedFile(null);
    } else {
      throw new Error(response?.data?.errorMessage || 'Operation failed');
    }
  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Something went wrong',
      confirmButtonColor: '#03045E'
    });
  }
};

const handleEdit = (subject) => {
  setSubjectId(subject.subjectId);
  setUserData({ 
    subjectName: subject.subjectName, 
    description: subject.description,
    url: subject.url,
    videoUrl: subject.videoUrl,
    fileName: subject.fileName,
    filePath: subject.filePath,
    semester: subject.semester
  });
  setEditMode(true);
  setOpen(true);
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

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between">
          <span>Subjects</span>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ backgroundColor: '#03045E', '&:hover': { opacity: 0.9 } }}
            // onClick={() => {
            //   setEditMode(false);
            //   setUserData({ subjectName: '', description: '' });
            //   setOpen(true);
            // }}
            onClick={() => {
  setEditMode(false);
  setUserData({ subjectName: '', description: '' });
  setErrors({}); // Clear previous validation errors
  setOpen(true);
}}

          >
            Add
          </Button>
        </Box>
      }
    >
      <Grid container spacing={gridSpacing}></Grid>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id} align={col.align} sx={{ fontWeight: 600 }}>{col.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {subjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover key={row.subjectId}>
                  <TableCell>{row.subjectId}</TableCell>
                  <TableCell>{row.subjectName}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.semester} </TableCell>
                  <TableCell>{row.url}</TableCell>
                  <TableCell>{row.videoUrl}</TableCell>
                  <TableCell>{row.file}</TableCell>
                  <TableCell align="right">{row.createdBy}</TableCell>
                  <TableCell align="right">{row.updatedBy}</TableCell>
                  <TableCell align="right">{row.insertedDate}</TableCell>
                  <TableCell align="right">{row.updatedDate}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(row)} sx={{ color: "#03045E" }}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(row.subjectId)} color="error"><DeleteForever /></IconButton>
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
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 100]}
        />
      </Paper>

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
  <DialogTitle sx={{ fontSize: '16px' }}>
    {editMode ? 'Edit Subject' : 'Add Subject'}
  </DialogTitle>

  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: 3 }}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Subject Name"
          name="subjectName"
          value={userdata.subjectName}
          onChange={(e) => setUserData({ ...userdata, subjectName: e.target.value })}
          error={!!errors.subjectName}
          helperText={errors.subjectName}
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
          onChange={(e) => setUserData({ ...userdata, description: e.target.value })}
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
  <TextField
    fullWidth
    label="Semester (comma separated)"
    name="semester"
    value={userdata.semester}
    onChange={(e) => setUserData({ 
      ...userdata, 
      semester: e.target.value.split(',').map(s => s.trim()) 
    })}
    error={!!errors.semester}
    helperText={errors.semester || "Enter semesters as comma separated values (e.g., 1,2,3)"}
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
          label="URL"
          name="url"
          value={userdata.url}
          onChange={changeHandler}
          error={!!errors.url}
          helperText={errors.url}
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
          label="Video URL"
          name="videoUrl"
          value={userdata.videoUrl}
          onChange={changeHandler}
          error={!!errors.videoUrl}
          helperText={errors.videoUrl}
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
          label="File Name"
          name="fileName"
          value={userdata.fileName}
          disabled
          InputProps={{
            endAdornment: (
              <Button
                variant="contained"
                onClick={onFileUpload}
                disabled={!selectedFile || isUploading}
                sx={{
                  backgroundColor: "#03045E",
                  '&:hover': {
                    backgroundColor: "#03045E",
                    opacity: 0.9,
                  },
                  '&:disabled': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                Upload
              </Button>
            ),
          }}
        />

        <input
          type="file"
          ref={inputRef}
          onChange={onFileChange}
          style={{ marginTop: '10px' }}
          accept="*/*"
        />
        {isUploading && (
          <Box sx={{ width: '100%', mt: 1 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span>{uploadProgress}%</span>
            </Box>
          </Box>
        )}
      </Grid>

      
    </Grid>

    <DialogActions>
      <Button onClick={() => setOpen(false)} sx={{ color: "#03045E" }}>
        Cancel
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={isUploading}
        sx={{
          backgroundColor: "#03045E",
          '&:hover': {
            backgroundColor: "#03045E",
            opacity: 0.9,
          },
        }}
      >
        {editMode ? 'Update' : 'Save'}
      </Button>
    </DialogActions>
  </Box>
</Dialog>

    </MainCard>
  );
};

export default Subjects;
