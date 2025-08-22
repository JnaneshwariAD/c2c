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
// // import { fetchBanner, addBanner, deleteBanner, getAdvertiseById, updatedAdvertise } from 'views/API/BannerApi';
// import { BaseUrl } from 'BaseUrl';
// import { useState, useEffect, useRef } from 'react';
// import moment from 'moment';
// import { Box, Button, Dialog, DialogActions, DialogTitle, TextField, Container, IconButton, LinearProgress } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import axios from 'axios';
// import { DeleteForever, Edit } from '@mui/icons-material';
// import {addCandidate, deleteCandidate, fetchCandidates, getCandidateById, updateCandidates } from 'views/API/CandidatesApi';
// import Swal from 'sweetalert2';

// const columns = [
//   { id: 'mobileUserId', label: 'ID', align: 'center' },
//   { id: 'file', label: 'File', align: 'center' },
//   { id: 'fullName', label: 'Name', align: 'center' },
//   { id: 'mobileNumber', label: 'Mobile Number', minWidth: 150, align: 'center' },
//   { id: 'mailId', label: 'Mail ID', minWidth: 150, align: 'center' },
//   { id: 'createdBy', label: 'Created By', align: 'center' },
//   { id: 'updatedBy', label: 'Updated By', align: 'center' },
//   { id: 'insertedDate', label: 'Inserted Date', align: 'center' },
//   { id: 'updatedDate', label: 'Updated Date', align: 'center' },
//   { id: 'actions', label: 'Actions', align: 'center' }
// ];

// const Candidates = () => {
//   const theme = useTheme();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [advertisement, setAdvertisement] = useState([]);
//   const [candidate , setCandidate] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [userdata, setUserData] = useState({
//     fullName: '',
//     mobileNumber: '',
//     mailId: '',
//     fileName: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [fileError, setFileError] = useState('');
//   const [fileName, setFileName] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [refreshTrigger, setRefreshTrigger] = useState(false);
//   const [advertisementId, setAdvertisementId] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//    const [uploadProgress, setUploadProgress] = useState(0);

//   const inputRef = useRef(null);

//   const user = JSON.parse(sessionStorage.getItem('user'));
//   const headers = {
//     'Content-type': 'application/json',
//     Authorization: 'Bearer ' + user.accessToken
//   };

//   const fileUploadHeaders = {
//     'Content-Type': 'multipart/form-data',
//     Authorization: 'Bearer ' + user.accessToken
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//     const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

//   const FetchData = async () => {
//     try {
//       const res = await fetchCandidates(headers);
//       const fetchedData = res.data.content;
//       console.log(fetchedData)

//       if (fetchedData) {
//         const tableData = fetchedData.map((p) => ({
//           mobileUserId: p.mobileUserId,
//           fullName: p.fullName,
//           mobileNumber: p.mobileNumber,
//           mailId: p.mailId === null ? "Email not found" : p.mailId,
//           file:
//             p.profilePicPath === null ? (
//               'NO IMAGE FOUND'
//             ) : (
//               <img src={ImageUrl + p.profilePicPath} alt={p.profilePicName} style={{ width: 100, height: 50 }} />
//             ),
//           insertedDate: moment(p.insertedDate).format('L'),
//           updatedDate: moment(p.updatedDate).format('L'),
//           createdBy: p.createdBy ? p.createdBy.userName : 'No User',
//           updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
//         }));
//         setCandidate(tableData);
//       } else {
//         setCandidate([]);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     FetchData();
//   }, [refreshTrigger]);

//   // const postData = async (e) => {
//   //   e.preventDefault();
//   //   const formErrors = validateForm();

//   //   if (Object.keys(formErrors).length > 0) {
//   //     setErrors(formErrors);
//   //   } else {
//   //     try {
//   //       if (editMode) {
//   //         const updatedData = {
//   //           ...userdata,
//   //           advertisementId,
//   //           updatedBy: { userId: user.userId }
//   //         };
//   //         await updatedAdvertise(updatedData, headers);
//   //       } else {
//   //         await addCandidate(userdata, headers);
//   //       }
//   //       setUserData({ advertisementName: '', description: '', fileName: '' });
//   //       inputRef.current.value = null;
//   //       setRefreshTrigger((prev) => !prev);
//   //       setOpen(false);
//   //     } catch (error) {
//   //       console.error('Error saving advertisement:', error);
//   //     }
//   //   }
//   // };

// //   const postData = async (e) => {
// //   e.preventDefault();
// //   const formErrors = validateForm();

// //   if (Object.keys(formErrors).length > 0) {
// //     setErrors(formErrors);
// //     return;
// //   }

// //   try {
// //     if (editMode) {
// //       const updatedData = {
// //         ...userdata,
// //         updatedBy: { userId: user.userId }
// //       };
// //       const response = await updateCandidates(updatedData, headers);

// //       if (response.data.responseCode !== 201) {
// //         alert(response.data.errorMessage || 'Update failed');
// //         return;
// //       }
// //     } else {
// //       const newData = {
// //         ...userdata,
// //         createdBy: { userId: user.userId }
// //       };
// //       const response = await addCandidate(newData, headers);

// //       if (response.data.responseCode !== 201) {
// //         alert(response.data.errorMessage || 'Creation failed');
// //         return;
// //       }
// //     }

// //     setUserData({ fullName: '', mobileNumber: '', mailId: '', profilePicName: '' });
// //     inputRef.current.value = null;
// //     setRefreshTrigger(prev => !prev);
// //     setOpen(false);
// //     setEditMode(false);
// //   } catch (error) {
// //     console.error('Error saving candidate:', error);
// //   }
// // };

// // const postData = async (e) => {
// //   e.preventDefault();
// //   const formErrors = validateForm();
// //   if (Object.keys(formErrors).length > 0) {
// //     setErrors(formErrors);
// //     return;
// //   }

// //   const now = new Date().toISOString();

// //   try {
// //     if (editMode) {
// //       const updatedData = {
// //         ...userdata,
// //         updatedBy: {
// //           fullName: user.fullName,
// //           mobileNumber: user.mobileNumber,
// //           userId: user.userId,
// //           userName: user.userName
// //         },
// //         updatedDate: now
// //       };

// //       const response = await updateCandidates(updatedData, headers);
// //       if (response.data.responseCode !== 201) {
// //         alert(response.data.errorMessage || 'Update failed');
// //         return;
// //       }
// //     } else {
// //       const newData = {
// //         fullName: userdata.fullName,
// //         gender: userdata.gender || "Male", // or take from form
// //         insertedDate: now,
// //         lastLogin: now,
// //         lastView: now,
// //         mailId: userdata.mailId,
// //         mobileNumber: userdata.mobileNumber,
// //         mobileUserId: 0,
// //         otp: userdata.otp || "",
// //         password: userdata.password || "123456", // default or from form
// //         profilePicName: userdata.profilePicName || "",
// //         profilePicPath: userdata.profilePicPath || "",
// //         userName: userdata.userName || userdata.fullName, // or from form
// //         createdBy: {
// //           fullName: user.fullName,
// //           mobileNumber: user.mobileNumber,
// //           userId: user.userId,
// //           userName: user.userName
// //         },
// //         updatedBy: {
// //           fullName: user.fullName,
// //           mobileNumber: user.mobileNumber,
// //           userId: user.userId,
// //           userName: user.userName
// //         },
// //         updatedDate: now
// //       };

// //       const response = await addCandidate(newData, headers);
// //       if (response.data.responseCode !== 201) {
// //         alert(response.data.errorMessage || 'Creation failed');
// //         return;
// //       }
// //     }

// //     setUserData({ fullName: '', mobileNumber: '', mailId: '', profilePicName: '' });
// //     inputRef.current.value = null;
// //     setRefreshTrigger(prev => !prev);
// //     setOpen(false);
// //     setEditMode(false);
// //   } catch (error) {
// //     console.error('Error saving candidate:', error);
// //   }
// // };

// const postData = async (e) => {
//   e.preventDefault();

//   const formErrors = validateForm();
//   if (Object.keys(formErrors).length > 0) {
//     setErrors(formErrors);
//     return;
//   }

//   const now = new Date().toISOString();

//   try {
//     if (editMode) {
//       // Editing existing candidate
//       const updatedData = {
//         fullName: userdata.fullName,
//         mailId: userdata.mailId,
//         mobileNumber: userdata.mobileNumber,
//         profilePicName: userdata.profilePicName || "",
//         profilePicPath: userdata.profilePicPath || "",
//         updatedBy: { userId: user.userId },
//         updatedDate: now
//       };

//       console.log("Updating candidate:", updatedData);

//       const response = await updateCandidates(updatedData, headers);
//       if (response.data.responseCode !== 201) {
//         alert(response.data.errorMessage || "Update failed");
//         return;
//       }
//     } else {
//       // Adding new candidate
//       const newData = {
//         fullName: userdata.fullName,
//         gender: userdata.gender || "Male",
//         mailId: userdata.mailId,
//         mobileNumber: userdata.mobileNumber,
//         profilePicName: userdata.profilePicName || "",
//         profilePicPath: userdata.profilePicPath || "",
//         createdBy: { userId: user.userId },
//         updatedBy: { userId: user.userId },
//         insertedDate: now,
//         updatedDate: now
//       };

//       console.log("Creating candidate:", newData);

//       const response = await addCandidate(newData, headers);
//       if (response.data.responseCode !== 201) {
//         alert(response.data.errorMessage || "Creation failed");
//         return;
//       }
//     }

//     // Reset form
//     setUserData({ fullName: "", mobileNumber: "", mailId: "", profilePicName: "", profilePicPath: "" });
//     inputRef.current.value = null;
//     setSelectedFile(null);
//     setRefreshTrigger((prev) => !prev);
//     setOpen(false);
//     setEditMode(false);
//   } catch (error) {
//     console.error("Error saving candidate:", error);
//   }
// };


//   // const onFileUpload = async (e) => {
//   //   e.preventDefault();

//   //   if (!selectedFile) {
//   //     setFileError("Please select a file");
//   //     return;
//   //   }

//   //   const data = new FormData();
//   //   data.append("file", selectedFile);

//   //   try {
//   //     const res = await axios.post(`${BaseUrl}/file/uploadFile`, data, {
//   //       headers: {
         
//   //         Authorization: "Bearer " + user.accessToken,
//   //       },
//   //     });

//   //     setFileName(res.data.fileName);
//   //     setUserData({ ...userdata, profilePicName: res.data.fileName });
//   //     console.log(res.data);
//   //     alert(res.data.message);
//   //     setFileError("");
//   //   } catch (error) {
//   //     console.error("Error uploading file:", error);
//   //     setFileError("Error uploading file: " + error.message);
//   //   }
//   // };

//   const onFileUpload = async (e) => {
//       e.preventDefault();
//       if (!selectedFile) {
//         Swal.fire({
//           icon: 'error',
//           title: 'No file selected',
//           text: 'Please select a file to upload',
//           confirmButtonColor: theme.palette.primary.main
//         });
//         return;
//       }
  
//       const formData = new FormData();
//       formData.append('file', selectedFile);
  
//       try {
//         setIsUploading(true);
//         Swal.fire({
//           title: 'Uploading file...',
//           allowOutsideClick: false,
//           didOpen: () => {
//             Swal.showLoading();
//           }
//         });
  
//         const res = await axios.post(`${BaseUrl}/file/uploadFile`, formData, {
//           headers: fileUploadHeaders,
//           onUploadProgress: (progressEvent) => {
//             const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//             setUploadProgress(progress);
//           }
//         });
  
//         Swal.close();
  
//         if (res.status === 200) {
//           setUserData(prev => ({
//             ...prev,
//             fileName: res.data.fileName,
//             filePath: res.data.filePath
//           }));
//           Swal.fire({
//             icon: 'success',
//             title: 'Success!',
//             text: 'File uploaded successfully',
//             showConfirmButton: false,
//             timer: 1500
//           });
//         } else {
//           throw new Error(res.data.errorMessage || 'File upload failed');
//         }
//       } catch (error) {
//         console.error('Error uploading file:', error);
//         Swal.fire({
//           icon: 'error',
//           title: 'Upload error',
//           text: error.message || 'An error occurred while uploading the file',
//           confirmButtonColor: theme.palette.primary.main
//         });
//       } finally {
//         setIsUploading(false);
//         setUploadProgress(0);
//       }
//     };

//   // const onFileChange = (e) => {
//   //   setFileName(e.target.files[0].name);
//   //   setselectedFile(e.target.files[0]);
//   //   if (!selectedFile) {
//   //     // alert("image is selected");
//   //     return false;
//   //   }
//   // };
//   const onFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//       setUserData({
//         ...userdata,
//         fileName: e.target.files[0].name
//       });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!userdata.fullName || userdata.fullName.trim() === '') {
//       newErrors.fullName = 'Enter the name';
//     }

//     if (!userdata.mobileNumber || userdata.mobileNumber.trim() === '') {
//       newErrors.mobileNumber = 'Enter the mobile Number';
//     }
//     if (!userdata.mailId || userdata.mailId.trim() === '') {
//       newErrors.mailId = 'Enter the mobile Number';
//     }

//     // if (!userdata.fileName || userdata.fileName.trim() === '') {
//     //   newErrors.fileName = 'Select the file';
//     // }

//     return newErrors;
//   };

//   const changeHandler = (e) => {
//     setUserData({
//       ...userdata,
//       [e.target.name]: e.target.value,
//       createdBy: { userId: user.userId }
//     });

//     setErrors({
//       ...errors,
//       [e.target.name]: null
//     });
//   };

//   const handleAddCandidate = () => {
//     setEditMode(false);
//     setUserData({
//       fullName: '',
//       mobileNumber: '',
//       mailId: '',
//       fileName: ''
//     });
//     setSelectedFile(null);
//     setOpen(true);
//   };

//   const handleEdit = async (mobileUserId) => {
//     setEditMode(true);
//     setOpen(true);
//     try {
//       const res = await getCandidateById(mobileUserId, headers);
//       const det = res.data;
//       console.log(det)

//       setCandidate(det.mobileUserId);
//       // setUserData({
//       //   fullName: det.fullName,
//       //   mobileNumber: det.mobileNumber,
//       //   mailId: det.mailId,
//       //   profilePicName: det.profilePicName,
//       // });
//       setUserData({
//   fullName: det.fullName,
//   mobileNumber: det.mobileNumber,
//   mailId: det.mailId,
//   profilePicName: det.profilePicName || ''
// });

//     } catch (error) {
//       console.error('Error fetching advertisement details:', error);
//     }
//   };
//   // const updateData = async (e) => {
//   //   e.preventDefault();

//   //   const validationErrors = validateForm();
//   //   if (Object.keys(validationErrors).length > 0) {
//   //     setErrors(validationErrors);
//   //     return;
//   //   }

//   //   const updatedDataPayload = {
//   //     fullName: userdata.fullName,
//   //     mobileNumber: userdata.mobileNumber,
//   //     mailId: userdata.mailId,
//   //     updatedBy: { userId: user.userId }
//   //   };

//   //   console.log(updatedDataPayload);

//   //   try {
//   //     const response = await updateCandidates(updatedDataPayload, headers);
//   //     if (response.data.responseCode === 201) {
//   //       setRefreshTrigger(!refreshTrigger);
//   //       setOpen(false);
//   //       setEditMode(false);
//   //       setModuletId(null);
//   //       setUserData({
//   //         fullName: '',
//   //         mobileNumber: '',
//   //         mailId: '',
//   //       });
//   //       setSelectedCourses([]);
//   //       FetchData();
//   //     } else {
//   //       alert(response.data.errorMessage);
//   //     }
//   //   } catch (error) { }
//   //   FetchData();
//   //   // setOpen(false);
//   // };

//   const handleDelete = async (mobileUserId) => {
//     try {
//       await deleteCandidate(mobileUserId, headers);
//       FetchData();
//     } catch (error) {
//       console.error('Error deleting candidate:', error);
//     }
//   };

//   return (
//     <MainCard
//       title={
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <span>Candidates</span>
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
//             onClick={handleAddCandidate}
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
//               {candidate.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
//                 <TableRow hover role="checkbox" tabIndex={-1} key={row.advertisementId}>
//                   {columns.map((column) => (
//                     <TableCell key={column.id} align={column.align}>
//                       {column.id === 'actions' ? (
//                         <>
//                           <IconButton onClick={() => handleEdit(row.mobileUserId)} sx={{ color: "#03045E" }}>
//                             <Edit />
//                           </IconButton>
//                           <IconButton onClick={() => handleDelete(row.mobileUserId)} color="error">
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
//           count={candidate.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Candidate' : 'Add Candidate'}</DialogTitle>
//         <Box component="form" onSubmit={editMode ? updateData : postData} noValidate sx={{ p: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Full Name"
//                 name="fullName"
//                 value={userdata.fullName}
//                 onChange={changeHandler}
//                 error={!!errors.fullName}
//                 helperText={errors.fullName}
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
//                 label="Mobile Number"
//                 name="mobileNumber"
//                 value={userdata.mobileNumber}
//                 onChange={changeHandler}
//                 error={!!errors.mobileNumber}
//                 helperText={errors.mobileNumber}
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
//                 label="Mail Id"
//                 name="mailId"
//                 value={userdata.mailId}
//                 onChange={changeHandler}
//                 error={!!errors.mailId}
//                 helperText={errors.mailId}
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
//             {/* <Grid item xs={12}>
//               <TextField
//                 margin="normal"
//                 fullWidth
//                 id="profilePicName"
//                 label="File Name"
//                 name="profilePicName"
//                 autoComplete="profilePicName"
//                 value={userdata.profilePicName}
//                 disabled
//                 helperText={errors.profilePicName}
//                 error={!!errors.profilePicName}
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
//             </Grid> */}
//             <Grid item xs={12}>
//                           <TextField
//                             fullWidth
//                             label="File Name"
//                             name="fileName"
//                             value={userdata.fileName}
//                             disabled
//                             InputProps={{
//                               endAdornment: (
//                                 <Button
//                                   variant="contained"
//                                   onClick={onFileUpload}
//                                   disabled={!selectedFile || isUploading}
//                                   sx={{
//                                     backgroundColor: "#03045E",
//                                     '&:hover': {
//                                       backgroundColor: "#03045E",
//                                       opacity: 0.9
//                                     },
//                                     '&:disabled': {
//                                       backgroundColor: '#f5f5f5'
//                                     }
//                                   }}
//                                 >
//                                   Upload
//                                 </Button>
//                               )
//                             }}
//                           />
//                           <input
//                             type="file"
//                             ref={inputRef}
//                             onChange={onFileChange}
//                             style={{ display: 'none' }}
//                             accept="/"
//                           />
//                           <Button
//                             variant="outlined"
//                             onClick={() => inputRef.current.click()}
//                             sx={{ mt: 1, color: '#03045E', borderColor: '#03045E' }}
//                           >
//                             Select File
//                           </Button>
//                           {isUploading && (
//                             <Box sx={{ width: '100%', mt: 1 }}>
//                               <LinearProgress variant="determinate" value={uploadProgress} />
//                               <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//                                 <span>{uploadProgress}%</span>
//                               </Box>
//                             </Box>
//                           )}
//                         </Grid>
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

// export default Candidates;

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
// import { useState, useEffect } from 'react';
// import moment from 'moment';
// import { Box, Button, Dialog, DialogActions, DialogTitle, TextField, IconButton, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit } from '@mui/icons-material';
// import { fetchCandidates,  addCandidate, deleteCandidate } from '../../../API/CandidatesApi';

// const columns = [
//   { id: 'fullName', label: 'Full Name', minWidth: 120 },
//   { id: 'userName', label: 'Username', minWidth: 100 },
//   { id: 'gender', label: 'Gender', minWidth: 80 },
//   { id: 'mailId', label: 'Email', minWidth: 150 },
//   { id: 'mobileNumber', label: 'Mobile Number', minWidth: 120 },
//   { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
//   { id: 'updatedDate', label: 'Updated Date', align: 'right' },
//   { id: 'lastLogin', label: 'Last Login', align: 'right' },
//   { id: 'lastView', label: 'Last View', align: 'right' },
//   { id: 'actions', label: 'Actions', align: 'right' }
// ];

// const Candidate = () => {
//   const theme = useTheme();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [candidates, setCandidates] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [userdata, setUserData] = useState({
//     fullName: '',
//     userName: '',
//     gender: '',
//     mailId: '',
//     mobileNumber: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [refreshTrigger, setRefreshTrigger] = useState(false);
//   const [candidateId, setCandidateId] = useState(null);

//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const user = JSON.parse(sessionStorage.getItem('user'));
//   const headers = {
//     'Content-type': 'application/json',
//     Authorization: 'Bearer ' + user.accessToken
//   };

//   const FetchData = async () => {
//     try {
//       const res = await fetchCandidates(headers);
//       const fetchedData = res.data.content || [];

//       const tableData = fetchedData.map((p) => ({
//         candidateId: p.mobileUserId,
//         fullName: p.fullName,
//         userName: p.userName,
//         gender: p.gender,
//         mailId: p.mailId,
//         mobileNumber: p.mobileNumber,
//         insertedDate: p.insertedDate ? moment(p.insertedDate).format('L') : '',
//         updatedDate: p.updatedDate ? moment(p.updatedDate).format('L') : '',
//         lastLogin: p.lastLogin ? moment(p.lastLogin).format('L') : '',
//         lastView: p.lastView ? moment(p.lastView).format('L') : ''
//       }));

//       setCandidates(tableData);
//     } catch (error) {
//       console.error('Error fetching candidates:', error);
//     }
//   };

//   useEffect(() => {
//     FetchData();
//   }, [refreshTrigger]);

//   const validateForm = () => {
//     const newErrors = {};
//     if (!userdata.fullName) newErrors.fullName = 'Enter full name';
//     if (!userdata.userName) newErrors.userName = 'Enter username';
//     if (!userdata.gender) newErrors.gender = 'Select gender';
//     if (!userdata.mailId) newErrors.mailId = 'Enter email';
//     if (!userdata.mobileNumber) newErrors.mobileNumber = 'Enter mobile number';
//     return newErrors;
//   };

//   const changeHandler = (e) => {
//     setUserData({
//       ...userdata,
//       [e.target.name]: e.target.value
//     });
//     setErrors({ ...errors, [e.target.name]: null });
//   };

//   const handleAdd = () => {
//     setEditMode(false);
//     setUserData({
//       fullName: '',
//       userName: '',
//       gender: '',
//       mailId: '',
//       mobileNumber: ''
//     });
//     setOpen(true);
//   };

//   const handleEdit = async (id) => {
//     setEditMode(true);
//     setOpen(true);
//     try {
//       const res = await fetchCandidateById(id, headers);
//       const det = res.data;
//       setCandidateId(det.mobileUserId);
//       setUserData({
//         fullName: det.fullName,
//         userName: det.userName,
//         gender: det.gender,
//         mailId: det.mailId,
//         mobileNumber: det.mobileNumber
//       });
//     } catch (error) {
//       console.error('Error fetching candidate details:', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteCandidate(id, headers);
//       FetchData();
//     } catch (error) {
//       console.error('Error deleting candidate:', error);
//     }
//   };

//   const postData = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     const dataToPost = {
//       ...userdata,
//       createdBy: { userId: user.userId }
//     };
//     try {
//       const response = await addCandidate(dataToPost, headers);
//       if (response.data.responseCode === 201) {
//         setRefreshTrigger(!refreshTrigger);
//         setOpen(false);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const updateData = async (e) => {
//     e.preventDefault();
//     const updatedDataPayload = {
//       mobileUserId: candidateId,
//       ...userdata,
//       updatedBy: { userId: user.userId }
//     };
//     try {
//       const response = await updateCandidate(updatedDataPayload, headers);
//       if (response.data.responseCode === 201) {
//         setRefreshTrigger(!refreshTrigger);
//         setOpen(false);
//         setEditMode(false);
//         setCandidateId(null);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <MainCard
//       title={
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <span>Candidate</span>
//           <Button
//             variant="contained"
//             sx={{ backgroundColor: "#03045E", '&:hover': { opacity: 0.9, backgroundColor: "#03045E" } }}
//             onClick={handleAdd}
//           >
//             Add <AddIcon sx={{ color: '#fff' }} />
//           </Button>
//         </Box>
//       }
//     >
//       <Grid container spacing={gridSpacing}></Grid>
//       <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//         <TableContainer sx={{ maxHeight: 440 }}>
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Id</TableCell>
//                 {columns.map((column) => (
//                   <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, fontWeight: 600, fontSize: 15 }}>
//                     {column.label}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {candidates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
//                 <TableRow hover key={row.candidateId}>
//                   <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                   {columns.map((column) => (
//                     <TableCell key={column.id} align={column.align}>
//                       {column.id === 'actions' ? (
//                         <>
//                           <IconButton onClick={() => handleEdit(row.candidateId)} sx={{ color: "#03045E" }}>
//                             <Edit />
//                           </IconButton>
//                           <IconButton onClick={() => handleDelete(row.candidateId)} color="error">
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
//           count={candidates.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle>{editMode ? 'Edit Candidate' : 'Add Candidate'}</DialogTitle>
//         <Box component="form" onSubmit={editMode ? updateData : postData} sx={{ p: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <TextField fullWidth label="Full Name" name="fullName" value={userdata.fullName} onChange={changeHandler} error={!!errors.fullName} helperText={errors.fullName} />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField fullWidth label="Username" name="userName" value={userdata.userName} onChange={changeHandler} error={!!errors.userName} helperText={errors.userName} />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth error={!!errors.gender}>
//                 <InputLabel>Gender</InputLabel>
//                 <Select name="gender" value={userdata.gender} onChange={changeHandler}>
//                   <MenuItem value="">Select</MenuItem>
//                   <MenuItem value="Male">Male</MenuItem>
//                   <MenuItem value="Female">Female</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField fullWidth label="Email" name="mailId" value={userdata.mailId} onChange={changeHandler} error={!!errors.mailId} helperText={errors.mailId} />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField fullWidth label="Mobile Number" name="mobileNumber" value={userdata.mobileNumber} onChange={changeHandler} error={!!errors.mobileNumber} helperText={errors.mobileNumber} />
//             </Grid>
//           </Grid>
//           <DialogActions>
//             <Button onClick={() => setOpen(false)} sx={{ color: "#03045E" }}>Cancel</Button>
//             <Button type="submit" variant="contained" sx={{ backgroundColor: "#03045E", '&:hover': { opacity: 0.9, backgroundColor: "#03045E" } }}>
//               {editMode ? 'Update' : 'Save'}
//             </Button>
//           </DialogActions>
//         </Box>
//       </Dialog>
//     </MainCard>
//   );
// };

// export default Candidate;


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
// import { useState, useEffect } from 'react';
// import moment from 'moment';
// import { Box, Button, Dialog, DialogActions, DialogTitle, TextField, IconButton, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit } from '@mui/icons-material';
// import { fetchCandidates,getCandidateById, addCandidate, deleteCandidate , updateCandidates} from '../../../API/CandidatesApi';
// import Swal from 'sweetalert2';

// const columns = [
//   // { id: 'id', label: 'Id', minWidth: 120 },

//   { id: 'fullName', label: 'Full Name', minWidth: 120 },
//   { id: 'userName', label: 'Username', minWidth: 100 },
//   { id: 'gender', label: 'Gender', minWidth: 80 },
//   { id: 'mailId', label: 'Email', minWidth: 150 },
//   { id: 'mobileNumber', label: 'Mobile Number', minWidth: 120 },
//   { id: 'otp', label: 'OTP', minWidth: 100 },
//   { id: 'password', label: 'Password', minWidth: 100 },
//   { id: 'profilePicName', label: 'Profile Pic Name', minWidth: 150 },
//   { id: 'profilePicPath', label: 'Profile Pic Path', minWidth: 150 },
//   { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
//   { id: 'updatedDate', label: 'Updated Date', align: 'right' },
//   { id: 'lastLogin', label: 'Last Login', align: 'right' },
//   { id: 'lastView', label: 'Last View', align: 'right' },
//   { id: 'actions', label: 'Actions', align: 'right' }
// ];

// const Candidates = () => {
//   const theme = useTheme();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [candidates, setCandidates] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [userdata, setUserData] = useState({
//     fullName: '',
//     userName: '',
//     gender: '',
//     mailId: '',
//     mobileNumber: '',
//     otp: '',
//     password: '',
//     profilePicName: '',
//     profilePicPath: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [refreshTrigger, setRefreshTrigger] = useState(false);
//   // const [candidateId, setCandidateId] = useState(null);
//   const [mobileUserId, setmobileUserId] = useState(null);

//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const user = JSON.parse(sessionStorage.getItem('user'));
//   const headers = {
//     'Content-type': 'application/json',
//     Authorization: 'Bearer ' + user.accessToken
//   };

//   const FetchData = async () => {
//     try {
//       const res = await fetchCandidates(headers);
//       const fetchedData = res.data.content || [];

//       const tableData = fetchedData.map((p) => ({
//         mobileUserId: p.mobileUserId,
//         fullName: p.fullName,
//         userName: p.userName,
//         gender: p.gender,
//         mailId: p.mailId,
//         mobileNumber: p.mobileNumber,
//         otp: p.otp,
//         password: p.password,
//         profilePicName: p.profilePicName,
//         profilePicPath: p.profilePicPath,
//         insertedDate: p.insertedDate ? moment(p.insertedDate).format('L') : '',
//         updatedDate: p.updatedDate ? moment(p.updatedDate).format('L') : '',
//         lastLogin: p.lastLogin ? moment(p.lastLogin).format('L') : '',
//         lastView: p.lastView ? moment(p.lastView).format('L') : ''
//       }));

//       setCandidates(tableData);
//     } catch (error) {
//       console.error('Error fetching candidates:', error);
//     }
//   };

//   useEffect(() => {
//     FetchData();
//   }, [refreshTrigger]);

//   const validateForm = () => {
//     const newErrors = {};
//     if (!userdata.fullName) newErrors.fullName = 'Enter full name';
//     if (!userdata.userName) newErrors.userName = 'Enter username';
//     if (!userdata.gender) newErrors.gender = 'Select gender';
//     if (!userdata.mailId) newErrors.mailId = 'Enter email';
//     if (!userdata.mobileNumber) newErrors.mobileNumber = 'Enter mobile number';
//     return newErrors;
//   };

//   const changeHandler = (e) => {
//     setUserData({
//       ...userdata,
//       [e.target.name]: e.target.value
//     });
//     setErrors({ ...errors, [e.target.name]: null });
//   };

//   const handleAdd = () => {
//     setEditMode(false);
//     setUserData({
//       fullName: '',
//       userName: '',
//       gender: '',
//       mailId: '',
//       mobileNumber: '',
//       otp: '',
//       password: '',
//       profilePicName: '',
//       profilePicPath: ''
//     });
//     setOpen(true);
//   };

//   // const handleEdit = async (id) => {
//   //   setEditMode(true);
//   //   setOpen(true);
//   //   try {
//   //     const res = await getCandidateById(id, headers);
//   //     const det = res.data;
//   //     setCandidates(det.mobileUserId);
//   //     setUserData({
//   //       fullName: det.fullName || '',
//   //       userName: det.userName || '',
//   //       gender: det.gender || '',
//   //       mailId: det.mailId || '',
//   //       mobileNumber: det.mobileNumber || '',
//   //       otp: det.otp || '',
//   //       password: det.password || '',
//   //       profilePicName: det.profilePicName || '',
//   //       profilePicPath: det.profilePicPath || ''
//   //     });
//   //   } catch (error) {
//   //     console.error('Error fetching candidate details:', error);
//   //   }
//   // };

//   // const handleDelete = async (id) => {
//   //   try {
//   //     await deleteCandidate(id, headers);
//   //     FetchData();
//   //   } catch (error) {
//   //     console.error('Error deleting candidate:', error);
//   //   }
//   // };
 


// // const handleDelete = async (id) => {
// //   try {
// //     const data = await deleteCandidate(id, headers);
// //     if (data.responseCode === 200) {
// //       // maybe show success notification here
// //       FetchData();
// //     } else {
// //       console.error('Delete failed:', data.message);
// //       // optionally show error notification here
// //     }
// //   } catch (error) {
// //     console.error('Error deleting candidate:', error);
// //     // optionally show error notification here
// //   }
// // };
// const handleEdit = async (id) => {
//   setEditMode(true);
//   setOpen(true);
//   try {
//     const res = await getCandidateById(id, headers);
//     const det = res.data;

//     // ✅ store the ID for update
//     setmobileUserId(det.mobileUserId);

//     setUserData({
//       fullName: det.fullName || '',
//       userName: det.userName || '',
//       gender: det.gender || '',
//       mailId: det.mailId || '',
//       mobileNumber: det.mobileNumber || '',
//       otp: det.otp || '',
//       password: det.password || '',
//       profilePicName: det.profilePicName || '',
//       profilePicPath: det.profilePicPath || ''
//     });
//   } catch (error) {
//     console.error('Error fetching candidate details:', error);
//   }
// };


// const handleDelete = async (mobileUserId) => {
//   const result = await Swal.fire({
//     title: "Are you sure?",
//     text: "This candidate will be permanently deleted.",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#d33",
//     cancelButtonColor: "#3085d6",
//     confirmButtonText: "Yes, delete it!"
//   });

//   if (result.isConfirmed) {
//     try {
//       const data = await deleteCandidate(mobileUserId, headers);

//       if (data?.responseCode === 200) {
//         // Remove candidate from state instantly for faster UI
//         setCandidates(prev => prev.filter(c => c.mobileUserId !== mobileUserId));

//         Swal.fire({
//           icon: "success",
//           title: "Deleted!",
//           text: data.message || "Candidate deleted successfully.",
//           timer: 1500,
//           showConfirmButton: false
//         });
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: data.message || "Failed to delete candidate"
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.response?.data?.message || "An error occurred while deleting the candidate"
//       });
//     }
//   }
// };

//   // const postData = async (e) => {
//   //   e.preventDefault();
//   //   const validationErrors = validateForm();
//   //   if (Object.keys(validationErrors).length > 0) {
//   //     setErrors(validationErrors);
//   //     return;
//   //   }
//   //   const now = new Date().toISOString();
//   //   const dataToPost = {
//   //     ...userdata,
//   //     insertedDate: now,
//   //     updatedDate: now,
//   //     lastLogin: now,
//   //     lastView: now,
//   //     mobileUserId: 0,
//   //     createdBy: { userId: user.userId }
//   //   };
//   //   try {
//   //     const response = await addCandidate(dataToPost, headers);
//   //     if (response?.data?.responseCode === 201) {
//   //       setRefreshTrigger(!refreshTrigger);
//   //       setOpen(false);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error creating candidate:", error.response?.data || error.message);
//   //   }
//   // };


//   const postData = async (e) => {
//   e.preventDefault();

//   const validationErrors = validateForm();
//   if (Object.keys(validationErrors).length > 0) {
//     setErrors(validationErrors);
//     return;
//   }

//   const now = new Date().toISOString();
//   const dataToPost = {
//     ...userdata,
//     insertedDate: now,
//     updatedDate: now,
//     lastLogin: now,
//     lastView: now,
//     // ❌ remove mobileUserId: 0 → let backend assign it
//     createdBy: { userId: user.userId }
//   };

//   try {
//     const response = await addCandidate(dataToPost, headers);

//     if (response?.data?.responseCode === 201) {
//       Swal.fire({
//         icon: "success",
//         title: "Candidate Created",
//         text: response.data.message || "Candidate added successfully",
//         timer: 1500,
//         showConfirmButton: false
//       });

//       // ✅ Fetch latest list to get backend-assigned mobileUserId
//       await FetchData();

//       setOpen(false);
//     }
//   } catch (error) {
//     console.error("Error creating candidate:", error.response?.data || error.message);
//     Swal.fire({
//       icon: "error",
//       title: "Error",
//       text: error.response?.data?.errorMessage || error.message
//     });
//   }
// };


//  const updateData = async (e) => {
//   e.preventDefault();
//   const now = new Date().toISOString();
//   const updatedDataPayload = {
//     mobileUserId: mobileUserId, // ✅ must be set from handleEdit
//     ...userdata,
//     updatedDate: now,
//     updatedBy: { userId: user.userId }
//   };
//   try {
//     const response = await updateCandidates(updatedDataPayload, headers);
//     if (response?.responseCode === 201) {
//       setRefreshTrigger(!refreshTrigger);
//       setOpen(false);
//       setEditMode(false);
//     }
//   } catch (error) {
//     console.error("Error updating candidate:", error.response?.data || error.message);
//   }
// };


//   return (
//     <MainCard
//       title={
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <span>Candidate</span>
//           <Button
//             variant="contained"
//             sx={{ backgroundColor: "#03045E", '&:hover': { opacity: 0.9, backgroundColor: "#03045E" } }}
//             onClick={handleAdd}
//           >
//             Add <AddIcon sx={{ color: '#fff' }} />
//           </Button>
//         </Box>
//       }
//     >
//       <Grid container spacing={gridSpacing}></Grid>
//       <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//         <TableContainer sx={{ maxHeight: 440 }}>
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Id</TableCell>
//                 {columns.map((column) => (
//                   <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, fontWeight: 600, fontSize: 15 }}>
//                     {column.label}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {candidates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
//                 <TableRow hover key={row.mobileUserId}>
//                   <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                   {columns.map((column) => (
//                     <TableCell key={column.id} align={column.align}>
//                       {column.id === 'actions' ? (
//                         <>
//                           <IconButton onClick={() => handleEdit(row.mobileUserId)} sx={{ color: "#03045E" }}>
//                             <Edit />
//                           </IconButton>
//                           <IconButton onClick={() => handleDelete(row.mobileUserId)} color="error">
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
//           count={candidates.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle>{editMode ? 'Edit Candidate' : 'Add Candidate'}</DialogTitle>
//         <Box component="form" onSubmit={editMode ? updateData : postData} sx={{ p: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name" name="fullName" value={userdata.fullName} onChange={changeHandler} error={!!errors.fullName} helperText={errors.fullName} /></Grid>
//             <Grid item xs={12} sm={6}><TextField fullWidth label="Username" name="userName" value={userdata.userName} onChange={changeHandler} error={!!errors.userName} helperText={errors.userName} /></Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth error={!!errors.gender}>
//                 <InputLabel>Gender</InputLabel>
//                 <Select name="gender" value={userdata.gender} onChange={changeHandler}>
//                   <MenuItem value="">Select</MenuItem>
//                   <MenuItem value="Male">Male</MenuItem>
//                   <MenuItem value="Female">Female</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}><TextField fullWidth label="Email" name="mailId" value={userdata.mailId} onChange={changeHandler} error={!!errors.mailId} helperText={errors.mailId} /></Grid>
//             <Grid item xs={12} sm={6}><TextField fullWidth label="Mobile Number" name="mobileNumber" value={userdata.mobileNumber} onChange={changeHandler} error={!!errors.mobileNumber} helperText={errors.mobileNumber} /></Grid>
//             <Grid item xs={12} sm={6}><TextField fullWidth label="OTP" name="otp" value={userdata.otp} onChange={changeHandler} /></Grid>
//             <Grid item xs={12} sm={6}><TextField fullWidth label="Password" name="password" value={userdata.password} onChange={changeHandler} /></Grid>
//             <Grid item xs={12} sm={6}><TextField fullWidth label="Profile Pic Name" name="profilePicName" value={userdata.profilePicName} onChange={changeHandler} /></Grid>
//             <Grid item xs={12} sm={6}><TextField fullWidth label="Profile Pic Path" name="profilePicPath" value={userdata.profilePicPath} onChange={changeHandler} /></Grid>
//           </Grid>
//           <DialogActions>
//             <Button onClick={() => setOpen(false)} sx={{ color: "#03045E" }}>Cancel</Button>
//             <Button type="submit" variant="contained" sx={{ backgroundColor: "#03045E", '&:hover': { opacity: 0.9, backgroundColor: "#03045E" } }}>
//               {editMode ? 'Update' : 'Save'}
//             </Button>
//           </DialogActions>
//         </Box>
//       </Dialog>
//     </MainCard>
//   );
// };

// export default Candidates;


import * as React from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Grid, Box,
  Button, Dialog, DialogActions, DialogTitle, TextField,
  IconButton, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useState, useEffect } from 'react';
import moment from 'moment';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit } from '@mui/icons-material';
import {
  fetchCandidates, getCandidateById,
  addCandidate, deleteCandidate, updateCandidates
} from '../../../API/CandidatesApi';
import Swal from 'sweetalert2';

const columns = [
  { id: 'fullName', label: 'Full Name', minWidth: 120 },
  { id: 'userName', label: 'Username', minWidth: 100 },
  { id: 'gender', label: 'Gender', minWidth: 80 },
  { id: 'mailId', label: 'Email', minWidth: 150 },
  { id: 'mobileNumber', label: 'Mobile Number', minWidth: 120 },
  { id: 'otp', label: 'OTP', minWidth: 100 },
  { id: 'password', label: 'Password', minWidth: 100 },
  { id: 'profilePicName', label: 'Profile Pic Name', minWidth: 150 },
  { id: 'profilePicPath', label: 'Profile Pic Path', minWidth: 150 },
  { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
  { id: 'updatedDate', label: 'Updated Date', align: 'right' },
  { id: 'lastLogin', label: 'Last Login', align: 'right' },
  { id: 'lastView', label: 'Last View', align: 'right' },
  { id: 'actions', label: 'Actions', align: 'right' }
];

const Candidates = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [candidates, setCandidates] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userdata, setUserData] = useState({
    fullName: '',
    userName: '',
    gender: '',
    mailId: '',
    mobileNumber: '',
    otp: '',
    password: '',
    profilePicName: '',
    profilePicPath: ''
  });
  const [errors, setErrors] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [mobileUserId, setmobileUserId] = useState(null);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };

  const FetchData = async () => {
    try {
      const res = await fetchCandidates(headers);
      const fetchedData = res.data.content || [];

      const tableData = fetchedData.map((p) => ({
        mobileUserId: p.mobileUserId,
        fullName: p.fullName,
        userName: p.userName,
        gender: p.gender,
        mailId: p.mailId,
        mobileNumber: p.mobileNumber,
        otp: p.otp,
        password: p.password,
        profilePicName: p.profilePicName,
        profilePicPath: p.profilePicPath,
        insertedDate: p.insertedDate ? moment(p.insertedDate).format('L') : '',
        updatedDate: p.updatedDate ? moment(p.updatedDate).format('L') : '',
        lastLogin: p.lastLogin ? moment(p.lastLogin).format('L') : '',
        lastView: p.lastView ? moment(p.lastView).format('L') : ''
      }));

      setCandidates(tableData);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  useEffect(() => {
    FetchData();
  }, [refreshTrigger]);

  const validateForm = () => {
    const newErrors = {};
    if (!userdata.fullName) newErrors.fullName = 'Enter full name';
    if (!userdata.userName) newErrors.userName = 'Enter username';
    if (!userdata.gender) newErrors.gender = 'Select gender';
    if (!userdata.mailId) newErrors.mailId = 'Enter email';
    if (!userdata.mobileNumber) newErrors.mobileNumber = 'Enter mobile number';
    return newErrors;
  };

  const changeHandler = (e) => {
    setUserData({
      ...userdata,
      [e.target.name]: e.target.value
    });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleAdd = () => {
    setEditMode(false);
    setUserData({
      fullName: '',
      userName: '',
      gender: '',
      mailId: '',
      mobileNumber: '',
      otp: '',
      password: '',
      profilePicName: '',
      profilePicPath: ''
    });
    setOpen(true);
  };

  const handleEdit = async (id) => {
    setEditMode(true);
    setOpen(true);
    try {
      const res = await getCandidateById(id, headers);
      const det = res.data;
      setmobileUserId(det.mobileUserId);

      setUserData({
        fullName: det.fullName || '',
        userName: det.userName || '',
        gender: det.gender || '',
        mailId: det.mailId || '',
        mobileNumber: det.mobileNumber || '',
        otp: det.otp || '',
        password: det.password || '',
        profilePicName: det.profilePicName || '',
        profilePicPath: det.profilePicPath || ''
      });
    } catch (error) {
      console.error('Error fetching candidate details:', error);
    }
  };

  const handleDelete = async (mobileUserId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This candidate will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        const data = await deleteCandidate(mobileUserId, headers);
        if (data?.responseCode === 200) {
          setCandidates(prev => prev.filter(c => c.mobileUserId !== mobileUserId));
          Swal.fire("Deleted!", "Candidate deleted successfully.", "success");
        } else {
          Swal.fire("Error", data.message || "Failed to delete candidate", "error");
        }
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Delete failed", "error");
      }
    }
  };

  const postData = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const now = new Date().toISOString();
    const dataToPost = {
      ...userdata,
      mobileUserId: 0, // backend will assign
      insertedDate: now,
      updatedDate: now,
      lastLogin: now,
      lastView: now,
      createdBy: {
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        userId: user.userId,
        userName: user.userName
      },
      updatedBy: {
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        userId: user.userId,
        userName: user.userName
      }
    };

    try {
      const response = await addCandidate(dataToPost, headers);
      if (response?.data?.responseCode === 201) {
        Swal.fire("Success", "Candidate created successfully", "success");
        await FetchData();
        setOpen(false);
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.errorMessage || "Create failed", "error");
    }
  };

  const updateData = async (e) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const updatedDataPayload = {
      mobileUserId,
      ...userdata,
      updatedDate: now,
      updatedBy: {
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        userId: user.userId,
        userName: user.userName
      }
    };

    try {
      const response = await updateCandidates(updatedDataPayload, headers);
      if (response?.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
        setEditMode(false);
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.errorMessage || "Update failed", "error");
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Candidate</span>
          <Button variant="contained" onClick={handleAdd} sx={{ backgroundColor: "#03045E" }}>
            Add <AddIcon sx={{ color: '#fff' }} />
          </Button>
        </Box>
      }
    >
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, fontWeight: 600 }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {candidates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow hover key={row.mobileUserId}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'actions' ? (
                        <>
                          <IconButton onClick={() => handleEdit(row.mobileUserId)} sx={{ color: "#03045E" }}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(row.mobileUserId)} color="error">
                            <DeleteForever />
                          </IconButton>
                        </>
                      ) : row[column.id]}
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
          count={candidates.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editMode ? 'Edit Candidate' : 'Add Candidate'}</DialogTitle>
        <Box component="form" onSubmit={editMode ? updateData : postData} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name" name="fullName" value={userdata.fullName} onChange={changeHandler} error={!!errors.fullName} helperText={errors.fullName} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Username" name="userName" value={userdata.userName} onChange={changeHandler} error={!!errors.userName} helperText={errors.userName} /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.gender}>
                <InputLabel>Gender</InputLabel>
                <Select name="gender" value={userdata.gender} onChange={changeHandler}>
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Email" name="mailId" value={userdata.mailId} onChange={changeHandler} error={!!errors.mailId} helperText={errors.mailId} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Mobile Number" name="mobileNumber" value={userdata.mobileNumber} onChange={changeHandler} error={!!errors.mobileNumber} helperText={errors.mobileNumber} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="OTP" name="otp" value={userdata.otp} onChange={changeHandler} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Password" name="password" value={userdata.password} onChange={changeHandler} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Profile Pic Name" name="profilePicName" value={userdata.profilePicName} onChange={changeHandler} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Profile Pic Path" name="profilePicPath" value={userdata.profilePicPath} onChange={changeHandler} /></Grid>
          </Grid>
          <DialogActions>
            <Button onClick={() => setOpen(false)} sx={{ color: "#03045E" }}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#03045E" }}>
              {editMode ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </MainCard>
  );
};

export default Candidates;
