// import * as React from 'react';
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import Grid from '@mui/material/Grid';
// import { useTheme } from '@mui/material/styles';
// import MainCard from 'ui-component/cards/MainCard';
// import { gridSpacing } from 'store/constant';
// import { BaseUrl } from 'BaseUrl';
// import { useState, useEffect, useRef } from 'react';
// import moment from 'moment';
// import { Box } from '@mui/system';
// import { Button, Dialog, DialogActions, DialogTitle, TextField, IconButton } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import Edit from '@mui/icons-material/Edit';
// import DeleteForever from '@mui/icons-material/DeleteForever';
// import axios from 'axios';
// import { addSuccess, deleteSuccess, fetchSuccess, getSuccessById, updatedSuccess } from 'views/API/SuccessStoryApi';
// import Swal from 'sweetalert2';


// const columns = [
//   { id: 'successstoryId', label: 'ID', align: 'center' },
//   { id: 'successstoryName', label: 'Name', align: 'center' },
//   { id: 'description', label: 'Description', minWidth: 100, align: 'center' },
//   { id: 'file', label: 'File', align: 'center' },
//   { id: 'createdBy', label: 'Created By', align: 'center' },
//   { id: 'updatedBy', label: 'Updated By', align: 'center' },
//   { id: 'insertedDate', label: 'Inserted Date', align: 'center' },
//   { id: 'updatedDate', label: 'Updated Date', align: 'center' },
//   { id: 'actions', label: 'Actions', align: 'center' }
// ];

// const SuccessStory = () => {
//   const theme = useTheme();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [news, setNews] = useState([]);
//   const [editMode, setEditMode] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [successstoryId, setSuccessstoryId] = useState(null);
//   const [photoName, setPhotoName] = useState('');
//   const [errors, setErrors] = useState({});
//   const [selectedFile, setSelectedFile] = useState(null);
//   const inputRef = useRef(null);
//   const [fileError, setFileError] = useState('');
//   const [refreshTrigger, setRefreshTrigger] = useState(false);
//   const [userdata, setUserData] = useState({
//     successstoryName: '',
//     description: ''
//   });

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const user = JSON.parse(sessionStorage.getItem('user'));
//   const headers = {
//     'Content-type': 'application/json',
//     Authorization: `Bearer ${user.accessToken}`
//   };

//   const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

//   const fetchData = async () => {
//     try {
//       const res = await fetchSuccess(headers);
//       const fetchedData = res.data.content;

//       if (fetchedData) {
//         const tableData = fetchedData.map((p) => ({
//           successstoryId: p.successstoryId,
//           successstoryName: p.successstoryName,
//           description: p.description,
//           file: p.photoPath ? <img src={ImageUrl + p.photoPath} alt={p.photoName} style={{ width: 100, height: 50 }} /> : 'NO IMAGE FOUND',
//           insertedDate: moment(p.insertedDate).format('L'),
//           updatedDate: moment(p.updatedDate).format('L'),
//           createdBy: p.createdBy ? p.createdBy.userName : 'No User',
//           updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
//         }));
//         setNews(tableData);
//       } else {
//         setNews([]);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [refreshTrigger]);

//   const validateForm = () => {
//     const newErrors = {};

//     if (!userdata.successstoryName.trim()) {
//       newErrors.successstoryName = 'Enter the News';
//     }

//     if (!userdata.description.trim()) {
//       newErrors.description = 'Enter the Description';
//     }

//     if (!userdata.photoName || userdata.photoName.trim() === '') {
//       newErrors.photoName = 'Select the file';
//     }

//     return newErrors;
//   };

//   const changeHandler = (e) => {
//     setUserData({
//       ...userdata,
//       [e.target.name]: e.target.value
//     });

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [e.target.name]: null
//     }));
//   };

//   const handleDelete = async (successstoryId) => {
//     try {
//       await deleteSuccess(successstoryId, headers);
//       setRefreshTrigger((prev) => !prev);
//     } catch (error) {
//       console.error('Error deleting news:', error);
//     }
//   };

//   const handleEdit = async (successstoryId) => {
//     setEditMode(true);
//     setOpen(true);
//     try {
//       const res = await getSuccessById(successstoryId, headers);
//       const det = res.data;

//       setSuccessstoryId(det.successstoryId);
//       setUserData({
//         successstoryName: det.successstoryName,
//         description: det.description,
//         photoName: det.photoName
//       });
//     } catch (error) {
//       console.error('Error fetching news by ID:', error);
//     }
//   };

//   const onFileUpload = async (e) => {
//     e.preventDefault();

//     if (!selectedFile) {
//       setFileError('Please select a file');
//       return;
//     }

//     const data = new FormData();
//     data.append('file', selectedFile);

//     try {
//       const res = await axios.post(`${BaseUrl}/file/uploadFile`, data, {
//         headers: {
//           'content-type': 'multipart/form-data',
//           Authorization: `Bearer ${user.accessToken}`
//         }
//       });

//       setPhotoName(res.data.fileName);
//       setUserData((prevData) => ({ ...prevData, photoName: res.data.fileName }));
//       setFileError('');


//       Swal.fire({
//         target: document.getElementById("your-dialog-id"),
//         icon: 'success',
//         title: 'Upload Successful',
//         text: res.data.message || 'File uploaded successfully!'
//       });

//       console.log(res.data);
//     } catch (error) {
//       console.error('Error uploading file:', error);


//       Swal.fire({
//         icon: 'error',
//         title: 'Upload Failed',
//         text: 'Something went wrong while uploading the file.'
//       });
//     }
//   };


//   const onFileChange = (e) => {
//     setPhotoName(e.target.files[0].name);
//     setSelectedFile(e.target.files[0]);
//   };

//   const postData = async (e) => {
//     e.preventDefault();
//     const formErrors = validateForm();

//     console.log(userdata);
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//     } else {
//       try {
//         if (editMode) {
//           const updatedData = {
//             ...userdata,
//             successstoryId,
//             updatedBy: { userId: user.userId }
//           };
//           await updatedSuccess(updatedData, headers);
//         } else {
//           const newData = {
//             ...userdata,
//             createdBy: { userId: user.userId }
//           };
//           await addSuccess(newData, headers);
//         }
//         setUserData({ successstoryName: '', description: '', photoName: '' });
//         inputRef.current.value = null;
//         setRefreshTrigger((prev) => !prev);
//         setOpen(false);
//       } catch (error) {
//         console.error('Error saving news:', error);
//       }
//     }
//   };

//   const handleAddNews = () => {
//     setEditMode(false);
//     setUserData({
//       successstoryName: '',
//       description: '',
//       photoName: ''
//     });
//     setOpen(true);
//   };

//   return (
//     <MainCard
//       title={
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <span>SuccessStory</span>
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{
//               display: 'flex', alignItems: 'center', fontSize: '15px', backgroundColor: "#03045E",
//               '&:hover': {
//                 backgroundColor: "#03045E",
//                 opacity: 0.9
//               }
//             }}
//             onClick={handleAddNews}
//           >
//             Add
//             <AddIcon sx={{ color: '#fff' }} />
//           </Button>
//         </Box>
//       }
//     >
//       <Grid container spacing={gridSpacing}></Grid>
//       <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//         <TableContainer sx={{ maxHeight: 440 }}>
//           <Table stickyHeader aria-label="sticky table">
//             <TableHead>
//               <TableRow>
//                 {columns.map((column) => (
//                   <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, fontWeight: 600, fontSize: 15 }}>
//                     {column.label}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {news.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
//                 <TableRow hover role="checkbox" tabIndex={-1} key={row.successstoryId}>
//                   {columns.map((column) => (
//                     <TableCell key={column.id} align={column.align}>
//                       {column.id === 'actions' ? (
//                         <>
//                           <IconButton onClick={() => handleEdit(row.successstoryId)} sx={{color:"#03045E"}}>
//                             <Edit />
//                           </IconButton>
//                           <IconButton onClick={() => handleDelete(row.successstoryId)} color="error">
//                             <DeleteForever />
//                           </IconButton>
//                         </>
//                       ) : (
//                         row[column.id]
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[10, 25, 100]}
//           component="div"
//           count={news.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>

//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" id="your-dialog-id">
//         <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit SuccessStory' : 'Add SuccessStory'}</DialogTitle>
//         <Box component="form" onSubmit={postData} noValidate sx={{ p: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="SuccessStory Name"
//                 name="successstoryName"
//                 value={userdata.successstoryName}
//                 onChange={changeHandler}
//                 error={!!errors.successstoryName}
//                 helperText={errors.successstoryName}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '&.Mui-focused fieldset': {
//                       borderColor: '#03045E',
//                     },
//                   },
//                   '& .MuiInputLabel-root.Mui-focused': {
//                     color: '#03045E',
//                   },
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Description"
//                 name="description"
//                 value={userdata.description}
//                 onChange={changeHandler}
//                 error={!!errors.description}
//                 helperText={errors.description}
//                 multiline
//                 rows={3}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '&.Mui-focused fieldset': {
//                       borderColor: '#03045E',
//                     },
//                   },
//                   '& .MuiInputLabel-root.Mui-focused': {
//                     color: '#03045E',
//                   },
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 margin="normal"
//                 fullWidth
//                 id="photoName"
//                 label="File Name"
//                 name="photoName"
//                 autoComplete="photoName"
//                 value={userdata.photoName}
//                 disabled
//                 helperText={errors.photoName}
//                 error={!!errors.photoName}
//                 InputProps={{
//                   endAdornment: (
//                     <Button variant="contained" sx={{
//                       backgroundColor: "#03045E",
//                       '&:hover': {
//                         backgroundColor: "#03045E",
//                         opacity: 0.9
//                       }
//                     }} onClick={onFileUpload}>
//                       Upload
//                     </Button>
//                   )
//                 }}
//               />
//               <input type="file" onChange={onFileChange} ref={inputRef} style={{ marginTop: 20 }} />
//             </Grid>
//           </Grid>
//           <DialogActions>
//             <Button onClick={() => setOpen(false)} sx={{ color: "#03045E" }}>Cancel</Button>
//             <Button type="submit" variant="contained" sx={{
//               backgroundColor: "#03045E",
//               '&:hover': {
//                 backgroundColor: "#03045E",
//                 opacity: 0.9
//               }
//             }}>
//               {editMode ? 'Update' : 'Save'}
//             </Button>
//           </DialogActions>
//         </Box>
//       </Dialog>
//     </MainCard>
//   );
// };

// export default SuccessStory;

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { BaseUrl } from 'BaseUrl';
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Box } from '@mui/system';
import { Button, Dialog, DialogActions, DialogTitle, TextField, IconButton, ToggleButtonGroup, ToggleButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import DeleteForever from '@mui/icons-material/DeleteForever';
import { ViewList, ViewModule } from '@mui/icons-material';
import axios from 'axios';
import { addSuccess, deleteSuccess, fetchSuccess, getSuccessById, updatedSuccess } from 'views/API/SuccessStoryApi';
import Swal from 'sweetalert2';

// Import SuccessStoryCards component
import SuccessStoryCards from './SuccessStoryCards';

const columns = [
  { id: 'successstoryId', label: 'ID', align: 'center' },
  { id: 'successstoryName', label: 'Name', align: 'center' },
  { id: 'description', label: 'Description', minWidth: 100, align: 'center' },
  { id: 'file', label: 'File', align: 'center' },
  { id: 'createdBy', label: 'Created By', align: 'center' },
  { id: 'updatedBy', label: 'Updated By', align: 'center' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'center' },
  { id: 'updatedDate', label: 'Updated Date', align: 'center' },
  { id: 'actions', label: 'Actions', align: 'center' }
];

const SuccessStory = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [news, setNews] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // Added view mode state
  const [successstoryId, setSuccessstoryId] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);
  const [fileError, setFileError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userdata, setUserData] = useState({
    successstoryName: '',
    description: '',
    photoName: ''
  });

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
    Authorization: `Bearer ${user.accessToken}`
  };

  const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

  const fetchData = async () => {
    try {
      const res = await fetchSuccess(headers);
      const fetchedData = res.data.content;

      if (fetchedData) {
        // Sort by insertedDate (ascending)
        const sortedData = [...fetchedData].sort(
          (a, b) => new Date(a.insertedDate) - new Date(b.insertedDate)
        );

        const tableData = sortedData.map((p, index) => ({
          successstoryId: index + 1, // Serial number
          originalId: p.successstoryId, // Actual database ID for operations
          successstoryName: p.successstoryName,
          description: p.description,
          photoPath: p.photoPath, // Keep for card view
          file: p.photoPath ? <img src={ImageUrl + p.photoPath} alt={p.photoName} style={{ width: 100, height: 50 }} /> : 'NO IMAGE FOUND',
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy ? p.createdBy.userName : 'No User',
          updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
        }));
        setNews(tableData);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.successstoryName.trim()) {
      newErrors.successstoryName = 'Enter the Success Story Name';
    }

    if (!userdata.description.trim()) {
      newErrors.description = 'Enter the Description';
    }

    if (!userdata.photoName || userdata.photoName.trim() === '') {
      newErrors.photoName = 'Select the file';
    }

    return newErrors;
  };

  const changeHandler = (e) => {
    setUserData({
      ...userdata,
      [e.target.name]: e.target.value
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: null
    }));
  };

  const handleDelete = async (successstoryId) => {
    try {
      await deleteSuccess(successstoryId, headers);
      setRefreshTrigger((prev) => !prev);
    } catch (error) {
      console.error('Error deleting success story:', error);
    }
  };

  const handleEdit = async (successstoryId) => {
    setEditMode(true);
    setOpen(true);
    try {
      const res = await getSuccessById(successstoryId, headers);
      const det = res.data;

      setSuccessstoryId(det.successstoryId);
      setUserData({
        successstoryName: det.successstoryName,
        description: det.description,
        photoName: det.photoName
      });
    } catch (error) {
      console.error('Error fetching success story by ID:', error);
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
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.accessToken}`
        }
      });

      Swal.close();

      if (res.status === 200) {
        setPhotoName(res.data.fileName);
        setUserData(prev => ({
          ...prev,
          photoName: res.data.fileName,
          photoPath: res.data.filePath
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
    }
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPhotoName(e.target.files[0].name);
      setUserData({
        ...userdata,
        photoName: e.target.files[0].name
      });
    }
  };

  const postData = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      try {
        if (editMode) {
          const updatedData = {
            ...userdata,
            successstoryId,
            updatedBy: { userId: user.userId }
          };
          await updatedSuccess(updatedData, headers);
        } else {
          const newData = {
            ...userdata,
            createdBy: { userId: user.userId }
          };
          await addSuccess(newData, headers);
        }
        setUserData({ successstoryName: '', description: '', photoName: '' });
        inputRef.current.value = null;
        setRefreshTrigger((prev) => !prev);
        setOpen(false);
      } catch (error) {
        console.error('Error saving success story:', error);
      }
    }
  };

  const handleAddNews = () => {
    setEditMode(false);
    setUserData({
      successstoryName: '',
      description: '',
      photoName: ''
    });
    setOpen(true);
  };

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Success Story</span>
          <Box display="flex" alignItems="center" gap={1}>
            {/* Toggle Button Group */}
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
              sx={{
                display: 'flex', alignItems: 'center', fontSize: '15px', backgroundColor: "#03045E",
                '&:hover': {
                  backgroundColor: "#03045E",
                  opacity: 0.9
                }
              }}
              onClick={handleAddNews}
            >
              Add
              <AddIcon sx={{ color: '#fff' }} />
            </Button>
          </Box>
        </Box>
      }
    >
      <Grid container spacing={gridSpacing}></Grid>
      
      {/* Conditional rendering based on viewMode */}
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
                {news.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.successstoryId}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'actions' ? (
                          <>
                            <IconButton onClick={() => handleEdit(row.originalId)} sx={{color:"#03045E"}}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(row.originalId)} color="error">
                              <DeleteForever />
                            </IconButton>
                          </>
                        ) : (
                          row[column.id]
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
            count={news.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        // Use SuccessStoryCards component for card view
        <SuccessStoryCards
          news={news}
          page={page}
          rowsPerPage={rowsPerPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          ImageUrl={ImageUrl}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" id="your-dialog-id">
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Success Story' : 'Add Success Story'}</DialogTitle>
        <Box component="form" onSubmit={postData} noValidate sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Success Story Name"
                name="successstoryName"
                value={userdata.successstoryName}
                onChange={changeHandler}
                error={!!errors.successstoryName}
                helperText={errors.successstoryName}
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
              <TextField
                margin="normal"
                fullWidth
                id="photoName"
                label="File Name"
                name="photoName"
                autoComplete="photoName"
                value={userdata.photoName}
                disabled
                helperText={errors.photoName}
                error={!!errors.photoName}
                InputProps={{
                  endAdornment: (
                    <Button 
                      variant="contained" 
                      sx={{
                        backgroundColor: "#03045E",
                        '&:hover': {
                          backgroundColor: "#03045E",
                          opacity: 0.9
                        }
                      }} 
                      onClick={onFileUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  )
                }}
              />
              <input type="file" onChange={onFileChange} ref={inputRef} style={{ marginTop: 20 }} />
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

export default SuccessStory;