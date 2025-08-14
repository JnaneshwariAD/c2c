// import * as React from 'react';
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogTitle,
//   TextField,
//   Grid,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   IconButton,
//   Checkbox,
//   LinearProgress
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit } from '@mui/icons-material';
// import MainCard from 'ui-component/cards/MainCard';
// import { gridSpacing } from 'store/constant';
// import { useState, useEffect } from 'react';
// import moment from 'moment';
// import { useTheme } from '@mui/material/styles';
// import { addModule, deleteModule,  fetchModuleById, fetchModules, updatedModule } from 'views/API/ModuleApi';
// import {  fetchAllCourses } from 'views/API/CoursesApi';
// import { BaseUrl } from 'BaseUrl';
// import axios from 'axios';
// import Swal from 'sweetalert2';

// const columns = [
//   { id: 'moduleId', label: 'ID' },
//   { id: 'moduleName', label: 'Name', minWidth: 100 },
//   { id: 'description', label: 'Description', minWidth: 400 },
 
//   { id: 'courseName', label: 'Course Name', minWidth: 150 },
 
//   { id: 'semester', label: 'Semester' },
//   { id: 'url', label: 'Url' },
//   { id: 'videoUrl', label: 'VideoUrl' },
//   { 
//     id: 'file', 
//     label: 'Upload Syllabus', 
//     minWidth: 200,
//     format: (value) => (
//       value === null ? 'NO FILE FOUND' : (
//         <img src={`${BaseUrl}/file/downloadFile/?filePath=${value}`} alt="Module file" style={{ width: 100, height: 50 }} />
//       )
//     )
//   },
//   { id: 'createdBy', label: 'Created By', align: 'right' },
//   { id: 'updatedBy', label: 'Updated By', align: 'right' },
//   { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
//   { id: 'updatedDate', label: 'Updated Date', align: 'right' },
//   { id: 'actions', label: 'Actions', align: 'right' },
// ];

// const Modules = () => {
//   const theme = useTheme();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
  
//   const [courses, setCourses] = useState([]);
  
//   const [modules, setModules] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);
  

//   const [userdata, setUserData] = useState({
//   moduleName: '',
//   description: '',
//   courseId: [], // Keep as empty array for multi-select
//   videoUrl: '',
//   semester: '',
//   url: '',
//   fileName: '',
//   filePath: null
// });

//   const [errors, setErrors] = useState({});
//   const [refreshTrigger, setRefreshTrigger] = useState(false);
//   const [moduleId, setModuleId] = useState(null);
//   const inputRef = React.useRef(null);

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

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const fetchData = async () => {
//     try {
//       const res = await fetchModules(headers);
//       const fetchedData = res.data.content || [];
//       const tableData = fetchedData.map((p) => ({
//         moduleId: p.moduleId,
//         moduleName: p.moduleName,
//         // description: p.description,
//          description: (
//           <div style={{ 
//             textAlign: 'justify',
//             textJustify: 'inter-word',
//             whiteSpace: 'pre-line' 
//           }}>
//             {p.description}
//           </div>
//         ),
//         semester: p.semester,
//         courseName: p.courseDtoList?.map((course) => course.courseName).join(', ') || 'No course',
//         url: p.url,
//         videoUrl: p.videoUrl,
//         file: p.filePath,
//         insertedDate: moment(p.insertedDate).format('L'),
//         updatedDate: moment(p.updatedDate).format('L'),
//         createdBy: p.createdBy ? p.createdBy.userName : 'No User',
//         updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
//       }))
//                 .sort((a, b) => a.moduleId - b.moduleId); // For ascending by ID
      
//       setModules(tableData);
//     } catch (error) {
//       console.error('Error fetching modules:', error);
//     }
//   };

//   // const fetchCourses = async () => {
//   //   try {
//   //     const res = await fetchAllCourses(headers);
//   //     const fetchedData = res.data || [];
//   //     const sortedData = fetchedData.sort((a, b) => a.courseName.localeCompare(b.courseName));
//   //     const courseData = sortedData.map((c) => ({
//   //       courseId: c.courseId,
//   //       courseName: c.courseName
//   //     }));
//   //     setCourses(courseData);
//   //   } catch (error) {
//   //     console.error('Error fetching courses:', error);
//   //   }
//   // };
//   const fetchCourses = async () => {
//       try {
//         const res = await fetchAllCourses(headers);
//         const fetchedData = res.data;
//         console.log(fetchedData);
//         if (fetchedData) {
//           const sortedData = fetchedData.sort((a, b) => a.courseName.localeCompare(b.courseName));
//           const courseData = sortedData.map((c) => ({
//             courseId: c.courseId,
//         courseName: c.courseName
//           }));
//           setCourses(courseData);
//         }
//       } catch (error) {
//         console.error('Error fetching courses:', error);
//       }
//     };

//   useEffect(() => {
//     fetchData();
//     fetchCourses();
//   }, [refreshTrigger]);

  

//   const validateForm = () => {
//     const newErrors = {};

//     if (!userdata.moduleName.trim()) {
//       newErrors.moduleName = 'Enter the module name';
//     }

//     if (!userdata.description.trim()) {
//       newErrors.description = 'Enter the description';
//     }

//     if (userdata.courseId.length === 0) {
//       newErrors.courseId = 'Select at least one course';
//     }

//     if (!userdata.semester) {
//       newErrors.semester = 'Enter the semester';
//     }

//     if (!userdata.videoUrl.trim()) {
//       newErrors.videoUrl = 'Enter the video URL';
//     }

//     if (!userdata.url.trim()) {
//       newErrors.url = 'Enter the URL';
//     }

//     return newErrors;
//   };

//   const changeHandler = (e) => {
//     setUserData({
//       ...userdata,
//       [e.target.name]: e.target.value
//     });
//     setErrors({
//       ...errors,
//       [e.target.name]: null
//     });
//   };

//   const handleAddModule = () => {
//     setEditMode(false);
//     setUserData({
//       moduleName: '',
//       description: '',
//       courseId: [],
//       videoUrl: '',
//       semester: '',
//       url: '',
//       fileName: '',
//       filePath: null
//     });
//     setSelectedFile(null);
//     setOpen(true);
//   };

//   const onFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//       setUserData({
//         ...userdata,
//         fileName: e.target.files[0].name
//       });
//     }
//   };

//   const onFileUpload = async (e) => {
//     e.preventDefault();
//     if (!selectedFile) {
//       Swal.fire({
//         icon: 'error',
//         title: 'No file selected',
//         text: 'Please select a file to upload',
//         confirmButtonColor: theme.palette.primary.main
//       });
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     try {
//       setIsUploading(true);
//       Swal.fire({
//         title: 'Uploading file...',
//         allowOutsideClick: false,
//         didOpen: () => {
//           Swal.showLoading();
//         }
//       });

//       const res = await axios.post(`${BaseUrl}/file/uploadFile`, formData, {
//         headers: fileUploadHeaders,
//         onUploadProgress: (progressEvent) => {
//           const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setUploadProgress(progress);
//         }
//       });

//       Swal.close();

//       if (res.status === 200) {
//         setUserData(prev => ({
//           ...prev,
//           fileName: res.data.fileName,
//           filePath: res.data.filePath
//         }));
//         Swal.fire({
//           icon: 'success',
//           title: 'Success!',
//           text: 'File uploaded successfully',
//           showConfirmButton: false,
//           timer: 1500
//         });
//       } else {
//         throw new Error(res.data.errorMessage || 'File upload failed');
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Upload error',
//         text: error.message || 'An error occurred while uploading the file',
//         confirmButtonColor: theme.palette.primary.main
//       });
//     } finally {
//       setIsUploading(false);
//       setUploadProgress(0);
//     }
//   };

//  const postData = async (e) => {
//   e.preventDefault();

//   const validationErrors = validateForm();
//   if (Object.keys(validationErrors).length > 0) {
//     setErrors(validationErrors);
//     return;
//   }

//   const dataToPost = {
//     moduleName: userdata.moduleName,
//     description: userdata.description,
//     courseDtoList: userdata.courseId.map(id => ({ courseId: id })),
//     videoUrl: userdata.videoUrl,
//     semester: userdata.semester,
//     url: userdata.url,
//     fileName: userdata.fileName,
//     filePath: userdata.filePath,
//     createdBy: { userId: user.userId }
//   };
// console.log('Submitting data:', dataToPost);
//   try {
//     await addModule(dataToPost, headers);
//     setRefreshTrigger(!refreshTrigger);
//     setOpen(false);
//     setUserData({
//       moduleName: '',
//       description: '',
//       courseId: [],
//       videoUrl: '',
//       semester: '',
//       url: '',
//       fileName: '',
//       filePath: null
//     });
//   } catch (error) {
//     console.error('Error in postData:', error);
//     // Error handling is already done in addModule
//   }
// };

// const updateData = async (e) => {
//   e.preventDefault();

//   const validationErrors = validateForm();
//   if (Object.keys(validationErrors).length > 0) {
//     setErrors(validationErrors);
//     return;
//   }

//   const updatedDataPayload = {
//     moduleId: moduleId,
//     moduleName: userdata.moduleName,
//     description: userdata.description,
//     courseDtoList: userdata.courseId.map(id => ({ courseId: id })),
//     videoUrl: userdata.videoUrl,
//     semester: userdata.semester,
//     url: userdata.url,
//     fileName: userdata.fileName,
//     filePath: userdata.filePath,
//     updatedBy: { userId: user.userId }
//   };
// console.log('Updating module with:', updatedDataPayload);

//   try {
//     const response = await updatedModule(updatedDataPayload, headers);
//     if (response.data.responseCode === 200) {
//       setRefreshTrigger(!refreshTrigger);
//       setOpen(false);
//       setEditMode(false);
//       setModuleId(null);
//       Swal.fire({
//         icon: 'success',
//         title: 'Success',
//         text: 'Module updated successfully',
//         showConfirmButton: false,
//         timer: 1500
//       });
//     } else {
//       throw new Error(response.data.errorMessage || 'Failed to update module');
//     }
//   } catch (error) {
//     console.error('Error updating module:', error);
//     Swal.fire({
//       icon: 'error',
//       title: 'Error',
//       text: error.message,
//       confirmButtonColor: theme.palette.primary.main
//     });
//   }
// };

//   const handleEdit = async (id) => {
//     setEditMode(true);
//     setOpen(true);
//     setModuleId(id);
//     try {
//       const res = await fetchModuleById(id, headers);
//       const det = res.data;
//       setUserData({
//         moduleName: det.moduleName,
//         description: det.description,
//         courseId: det.courseDtoList?.map(course => course.courseId) || [],
//         videoUrl: det.videoUrl,
//         semester: det.semester,
//         url: det.url,
//         fileName: det.fileName,
//         filePath: det.filePath
//       });
//     } catch (error) {
//       console.error('Error fetching module details:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to fetch module details',
//         confirmButtonColor: theme.palette.primary.main
//       });
//     }
//   };

//    const handleDelete = async (id) => {
//   try {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#03045E',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, delete it!'
//     });

//     if (result.isConfirmed) {
//       console.log('Deleting module ID:', id);
//       await deleteModule(id, headers); // Just await the delete operation
//       setRefreshTrigger(!refreshTrigger); // Refresh regardless of response
//       Swal.fire({
//         icon: 'success',
//         title: 'Deleted!',
//         text: 'Module has been deleted.',
//         showConfirmButton: false,
//         timer: 1500
//       });
//     }
//   } catch (error) {
//     console.error('Error deleting module:', error);
//     let errorMessage = error.message;
//     if (error.message?.includes('foreign key constraint fails') || 
//         error.response?.data?.message?.includes('foreign key constraint fails')) {
//       errorMessage = 'This module is assigned to one or more batches and cannot be deleted.';
//     }
//     Swal.fire({
//       icon: 'error',
//       title: 'Error',
//       text: errorMessage,
//       confirmButtonColor: '#03045E'
//     });
//   }
// };

//   return (
//     <MainCard
//       title={
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <span>Modules</span>
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               fontSize: '15px',
//               backgroundColor: "#03045E",
//               '&:hover': {
//                 backgroundColor: "#03045E",
//                 opacity: 0.9
//               }
//             }}
//             onClick={handleAddModule}
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
//                   <TableCell
//                     key={column.id}
//                     align={column.align}
//                     style={{ minWidth: column.minWidth, fontWeight: 600, fontSize: 15 }}
//                   >
//                     {column.label}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {modules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
//                 <TableRow hover role="checkbox" tabIndex={-1} key={row.moduleId}>
//                   {columns.map((column) => (
//                     <TableCell key={column.id} align={column.align}>
//                       {column.id === 'actions' ? (
//                         <>
//                           <IconButton
//                             sx={{ color: "#03045E" }}
//                             onClick={() => handleEdit(row.moduleId)}
//                           >
//                             <Edit />
//                           </IconButton>
//                           <IconButton
//                             color="error"
//                             onClick={() => handleDelete(row.moduleId)}
//                           >
//                             <DeleteForever />
//                           </IconButton>
//                         </>
//                       ) : column.format ? (
//                         column.format(row[column.id])
//                       ) : (
//                         row[column.id] || 'No Data'
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
//           count={modules.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>

//   <Dialog
//   open={open}
//   onClose={() => setOpen(false)}
//   fullWidth
//   maxWidth="md"
//   aria-labelledby="module-dialog-title"
//   disableEnforceFocus
// > <DialogTitle id="module-dialog-title" sx={{ fontSize: '16px' }}>
//     {editMode ? 'Edit Module' : 'Add Module'}
//   </DialogTitle>
//   <Box 
//     component="form" 
//     onSubmit={editMode ? updateData : postData} 
//     noValidate 
//     sx={{ p: 3 }}
//   >
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Module Name"
//                 name="moduleName"
//                 value={userdata.moduleName}
//                 onChange={changeHandler}
//                 error={!!errors.moduleName}
//                 helperText={errors.moduleName}
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
           

//                        {/* <Grid item xs={12}>
//                           <FormControl fullWidth sx={{
//                             mb: 2, '& .MuiOutlinedInput-root': {
//                               '&.Mui-focused fieldset': {
//                                 borderColor: '#03045E',
//                               },
//                             },
//                             '& .MuiInputLabel-root.Mui-focused': {
//                               color: '#03045E',
//                             },
//                           }} >
//                             <InputLabel>Courses</InputLabel>
//                             <Select
//                               name="courseId"
//                               value={userdata.courseId}
//                               onChange={changeHandler}
//                               error={!!errors.courseId}
//                               helperText={errors.courseId}
//                             >
//                               {courses.map((course) => (
//                                 <MenuItem key={course.courseId} value={course.courseId}>
//                                   {course.courseName}
//                                 </MenuItem>
//                               ))}
//                             </Select>
//                           </FormControl>
//                         </Grid> */}

// <Grid item xs={12}>
//   <FormControl fullWidth error={!!errors.courseId}>
//     <InputLabel>Courses *</InputLabel>
//     <Select
//       multiple
//       name="courseId"
//       value={userdata.courseId || []}
//       onChange={(e) => {
//         setUserData({...userdata, courseId: e.target.value});
//       }}
//       renderValue={(selected) => {
//         if (selected.length === 0) {
//           return <em>Select courses</em>;
//         }
//         return selected.map(id => 
//           courses.find(c => c.courseId === id)?.courseName
//         ).join(', ');
//       }}
//       sx={{
//         '& .MuiOutlinedInput-root': {
//           '&.Mui-focused fieldset': {
//             borderColor: '#03045E',
//           },
//         },
//         '& .MuiInputLabel-root.Mui-focused': {
//           color: '#03045E',
//         },
//       }}
//     >
//       {courses.map((course) => (
//         <MenuItem key={course.courseId} value={course.courseId}>
//           {course.courseName}
//         </MenuItem>
//       ))}
//     </Select>
//     {errors.courseId && (
//       <Box sx={{color: 'red', fontSize: '0.75rem', mt: 1}}>
//         {errors.courseId}
//       </Box>
//     )}
//   </FormControl>
// </Grid>

//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Semester"
//                 name="semester"
//                 value={userdata.semester}
//                 onChange={changeHandler}
//                 error={!!errors.semester}
//                 helperText={errors.semester}
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
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Video URL"
//                 name="videoUrl"
//                 value={userdata.videoUrl}
//                 onChange={changeHandler}
//                 error={!!errors.videoUrl}
//                 helperText={errors.videoUrl}
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
//                 label="URL"
//                 name="url"
//                 value={userdata.url}
//                 onChange={changeHandler}
//                 error={!!errors.url}
//                 helperText={errors.url}
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
//                 label="File Name"
//                 name="fileName"
//                 value={userdata.fileName}
//                 disabled
//                 InputProps={{
//                   endAdornment: (
//                     <Button
//                       variant="contained"
//                       onClick={onFileUpload}
//                       disabled={!selectedFile || isUploading}
//                       sx={{
//                         backgroundColor: "#03045E",
//                         '&:hover': {
//                           backgroundColor: "#03045E",
//                           opacity: 0.9
//                         },
//                         '&:disabled': {
//                           backgroundColor: '#f5f5f5'
//                         }
//                       }}
//                     >
//                       Upload
//                     </Button>
//                   )
//                 }}
//               />
//               <input
//                 type="file"
//                 ref={inputRef}
//                 onChange={onFileChange}
//                 style={{ display: 'none' }}
//                 accept="/"
//               />
//               <Button
//                 variant="outlined"
//                 onClick={() => inputRef.current.click()}
//                 sx={{ mt: 1, color: '#03045E', borderColor: '#03045E' }}
//               >
//                 Select File
//               </Button>
//               {isUploading && (
//                 <Box sx={{ width: '100%', mt: 1 }}>
//                   <LinearProgress variant="determinate" value={uploadProgress} />
//                   <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//                     <span>{uploadProgress}%</span>
//                   </Box>
//                 </Box>
//               )}
//             </Grid>
//           </Grid>
//          <DialogActions sx={{ mt: 2 }}>
//       <Button
//         onClick={() => setOpen(false)}
//         sx={{
//           color: "#03045E",
//           '&:hover': {
//             backgroundColor: 'rgba(3, 4, 94, 0.04)'
//           }
//         }}
//       >
//         Cancel
//       </Button>
//       <Button
//         type="submit"
//         variant="contained"
//         sx={{
//           backgroundColor: "#03045E",
//           '&:hover': {
//             backgroundColor: "#03045E",
//             opacity: 0.9
//           }
//         }}
//       >
//         {editMode ? 'Update' : 'Save'}
//       </Button>
//     </DialogActions>
//         </Box>
//       </Dialog>
//     </MainCard>
//   );
// };

// export default Modules;

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
  LinearProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import { addModule, deleteModule, fetchModuleById, fetchModules, updatedModule } from 'views/API/ModuleApi';
import { fetchAllSubjects } from 'views/API/SubjectApi';
import { BaseUrl } from 'BaseUrl';
import axios from 'axios';
import Swal from 'sweetalert2';

const columns = [
  { id: 'moduleId', label: 'ID' },
  { id: 'moduleName', label: 'Name', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 400 },
  { id: 'subjectName', label: 'Subject Name', minWidth: 150 },
  {
    id: 'file',
    label: 'Upload Syllabus',
    minWidth: 200,
    format: (value) =>
      value === null ? 'NO FILE FOUND' : (
        <img
          src={`${BaseUrl}/file/downloadFile/?filePath=${value}`}
          alt="Module file"
          style={{ width: 100, height: 50 }}
        />
      )
  },
  { id: 'createdBy', label: 'Created By', align: 'right' },
  { id: 'updatedBy', label: 'Updated By', align: 'right' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
  { id: 'updatedDate', label: 'Updated Date', align: 'right' },
  { id: 'actions', label: 'Actions', align: 'right' }
];

const Modules = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [subjects, setSubjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [userdata, setUserData] = useState({
    moduleName: '',
    description: '',
    subjectId: [],
    fileName: '',
    filePath: null
  });

  const [errors, setErrors] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [moduleId, setModuleId] = useState(null);
  const inputRef = React.useRef(null);

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };

  const fileUploadHeaders = {
    'Content-Type': 'multipart/form-data',
    Authorization: 'Bearer ' + user.accessToken
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchData = async () => {
    try {
      const res = await fetchModules(headers);
      const fetchedData = res.data.content || [];
      const tableData = fetchedData
        .map((p) => ({
          moduleId: p.moduleId,
          moduleName: p.moduleName,
          description: (
            <div
              style={{
                textAlign: 'justify',
                textJustify: 'inter-word',
                whiteSpace: 'pre-line'
              }}
            >
              {p.description}
            </div>
          ),
          subjectName:
            p.subjectDtoList?.map((subject) => subject.subjectName).join(', ') ||
            'No subject',
          file: p.filePath,
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy ? p.createdBy.userName : 'No User',
          updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
        }))
        .sort((a, b) => a.moduleId - b.moduleId);

      setModules(tableData);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetchAllSubjects(headers);
      const fetchedData = res.data;
      if (fetchedData) {
        const sortedData = fetchedData.sort((a, b) =>
          a.subjectName.localeCompare(b.subjectName)
        );
        const subjectData = sortedData.map((s) => ({
          subjectId: s.subjectId,
          subjectName: s.subjectName
        }));
        setSubjects(subjectData);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const validateForm = () => {
    const newErrors = {};
    if (!userdata.moduleName.trim()) newErrors.moduleName = 'Enter the module name';
    if (!userdata.description.trim()) newErrors.description = 'Enter the description';
    if (userdata.subjectId.length === 0)
      newErrors.subjectId = 'Select at least one subject';
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

  const handleAddModule = () => {
    setEditMode(false);
    setUserData({
      moduleName: '',
      description: '',
      subjectId: [],
      fileName: '',
      filePath: null
    });
    setSelectedFile(null);
    setOpen(true);
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
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
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

  const postData = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dataToPost = {
      moduleName: userdata.moduleName,
      description: userdata.description,
      subjectDtoList: userdata.subjectId.map((id) => ({ subjectId: id })),
      fileName: userdata.fileName,
      filePath: userdata.filePath,
      createdBy: { userId: user.userId }
    };

    try {
      await addModule(dataToPost, headers);
      setRefreshTrigger(!refreshTrigger);
      setOpen(false);
      setUserData({
        moduleName: '',
        description: '',
        subjectId: [],
        fileName: '',
        filePath: null
      });
    } catch (error) {
      console.error('Error in postData:', error);
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
      moduleId: moduleId,
      moduleName: userdata.moduleName,
      description: userdata.description,
      subjectDtoList: userdata.subjectId.map((id) => ({ subjectId: id })),
      fileName: userdata.fileName,
      filePath: userdata.filePath,
      updatedBy: { userId: user.userId }
    };

    try {
      const response = await updatedModule(updatedDataPayload, headers);
      if (response.data.responseCode === 200) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
        setEditMode(false);
        setModuleId(null);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Module updated successfully',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        throw new Error(response.data.errorMessage || 'Failed to update module');
      }
    } catch (error) {
      console.error('Error updating module:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        confirmButtonColor: theme.palette.primary.main
      });
    }
  };

  const handleEdit = async (id) => {
    setEditMode(true);
    setOpen(true);
    setModuleId(id);
    try {
      const res = await fetchModuleById(id, headers);
      const det = res.data;
      setUserData({
        moduleName: det.moduleName,
        description: det.description,
        subjectId: det.subjectDtoList?.map((subject) => subject.subjectId) || [],
        fileName: det.fileName,
        filePath: det.filePath
      });
    } catch (error) {
      console.error('Error fetching module details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch module details',
        confirmButtonColor: theme.palette.primary.main
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#03045E',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await deleteModule(id, headers);
        setRefreshTrigger(!refreshTrigger);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Module has been deleted.',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      let errorMessage = error.message;
      if (
        error.message?.includes('foreign key constraint fails') ||
        error.response?.data?.message?.includes('foreign key constraint fails')
      ) {
        errorMessage =
          'This module is assigned to one or more batches and cannot be deleted.';
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#03045E'
      });
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Modules</span>
          <Button
            variant="contained"
            color="primary"
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '15px',
              backgroundColor: '#03045E',
              '&:hover': {
                backgroundColor: '#03045E',
                opacity: 0.9
              }
            }}
            onClick={handleAddModule}
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
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, fontWeight: 600, fontSize: 15 }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {modules
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.moduleId}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'actions' ? (
                          <>
                            <IconButton
                              sx={{ color: '#03045E' }}
                              onClick={() => handleEdit(row.moduleId)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(row.moduleId)}>
                              <DeleteForever />
                            </IconButton>
                          </>
                        ) : column.format ? (
                          column.format(row[column.id])
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
          count={modules.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        aria-labelledby="module-dialog-title"
        disableEnforceFocus
      >
        <DialogTitle id="module-dialog-title" sx={{ fontSize: '16px' }}>
          {editMode ? 'Edit Module' : 'Add Module'}
        </DialogTitle>
        <Box
          component="form"
          onSubmit={editMode ? updateData : postData}
          noValidate
          sx={{ p: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Module Name"
                name="moduleName"
                value={userdata.moduleName}
                onChange={changeHandler}
                error={!!errors.moduleName}
                helperText={errors.moduleName}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#03045E' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#03045E' }
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
                    '&.Mui-focused fieldset': { borderColor: '#03045E' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#03045E' }
                }}
              />
            </Grid>

            {/* <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.subjectId}>
                <InputLabel>Subjects *</InputLabel>
                <Select
                  multiple
                  name="subjectId"
                  value={userdata.subjectId || []}
                  onChange={(e) => {
                    setUserData({ ...userdata, subjectId: e.target.value });
                  }}
                  renderValue={(selected) => {
                    if (selected.length === 0) return <em>Select subjects</em>;
                    return selected
                      .map((id) => subjects.find((s) => s.subjectId === id)?.subjectName)
                      .join(', ');
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': { borderColor: '#03045E' }
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#03045E' }
                  }}
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject.subjectId} value={subject.subjectId}>
                      {subject.subjectName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.subjectId && (
                  <Box sx={{ color: 'red', fontSize: '0.75rem', mt: 1 }}>
                    {errors.subjectId}
                  </Box>
                )}
              </FormControl>
            </Grid> */}

            <Grid item xs={12}>
  <FormControl fullWidth error={!!errors.subjectId}>
    <InputLabel>Subjects *</InputLabel>
    <Select
      name="subjectId"
      value={userdata.subjectId || ''}
      onChange={(e) => {
        setUserData({ ...userdata, subjectId: e.target.value });
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': { borderColor: '#03045E' }
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#03045E' }
      }}
    >
      {subjects.map((subject) => (
        <MenuItem key={subject.subjectId} value={subject.subjectId}>
          {subject.subjectName}
        </MenuItem>
      ))}
    </Select>
    {errors.subjectId && (
      <Box sx={{ color: 'red', fontSize: '0.75rem', mt: 1 }}>
        {errors.subjectId}
      </Box>
    )}
  </FormControl>
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
                        backgroundColor: '#03045E',
                        '&:hover': { backgroundColor: '#03045E', opacity: 0.9 },
                        '&:disabled': { backgroundColor: '#f5f5f5' }
                      }}
                    >
                      Upload
                    </Button>
                  )
                }}
              />
              <input
                type="file"
                ref={inputRef}
                onChange={onFileChange}
                style={{ display: 'none' }}
                accept="/"
              />
              <Button
                variant="outlined"
                onClick={() => inputRef.current.click()}
                sx={{ mt: 1, color: '#03045E', borderColor: '#03045E' }}
              >
                Select File
              </Button>
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
          <DialogActions sx={{ mt: 2 }}>
            <Button
              onClick={() => setOpen(false)}
              sx={{
                color: '#03045E',
                '&:hover': { backgroundColor: 'rgba(3, 4, 94, 0.04)' }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#03045E',
                '&:hover': { backgroundColor: '#03045E', opacity: 0.9 }
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

export default Modules;
