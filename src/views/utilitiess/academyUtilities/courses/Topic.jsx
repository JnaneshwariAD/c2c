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
//   IconButton,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   FormHelperText,
//   Select
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit } from '@mui/icons-material';
// import MainCard from 'ui-component/cards/MainCard';
// import { gridSpacing } from 'store/constant';
// import { useState, useEffect, useRef } from 'react';
// import moment from 'moment';
// import { useTheme } from '@mui/material/styles';
// import { addTopic, deleteTopic, fetchAllModules, fetchTopics, fetchTopicById, updatedTopic } from 'views/API/TopicApi';
// import { BaseUrl } from 'BaseUrl';
// import axios from 'axios';
// import Swal from 'sweetalert2';

// const columns = [
//   { id: 'topicId', label: 'ID' },
//   { id: 'topicName', label: 'Name', minWidth: 150 },
//   { id: 'description', label: 'Description', minWidth: 450 },
//   { id: 'moduleName', label: 'Module', minWidth: 150 },
//   // { id: 'url', label: 'Url' },
//   { id: 'videoUrl', label: 'Upload Context Video' },
//   { id: 'file', label: 'Upload Pdf' , minWidth:200 },
//   { id: 'createdBy', label: 'Created By', align: 'right' },
//   { id: 'updatedBy', label: 'Updated By', align: 'right' },
//   { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
//   { id: 'updatedDate', label: 'Updated Date', align: 'right' },
//   { id: 'actions', label: 'Actions', align: 'right' }
// ];

// const AcademyTopics = () => {
//   const theme = useTheme();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [topics, setTopics] = useState([]);
//   const [modules, setModules] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [userdata, setUserData] = useState({
//     topicName: '',
//     description: '',
//     moduleId: '',
//     videoUrl: '',
//     // url: '',
//     fileName: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [refreshTrigger, setRefreshTrigger] = useState(false);
//   const [topicId, setTopicId] = useState(null);
//   const [fileError, setFileError] = useState('');
//   const [fileName, setFileName] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const inputRef = useRef(null);

//   const user = JSON.parse(sessionStorage.getItem('user'));
//   const headers = {
//     'Content-type': 'application/json',
//     Authorization: 'Bearer ' + user.accessToken
//   };

//   const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

//   const fetchData = async () => {
//     try {
//       const res = await fetchTopics(headers);
//       const fetchedData = res.data.content;
//       if (fetchedData) {
//         const tableData = fetchedData.map((p) => ({
//           topicId: p.topicId,
//           topicName: p.topicName,
//           // description: p.description,
//           description: (
//           <div style={{ 
//             textAlign: 'justify',
//             textJustify: 'inter-word',
//             whiteSpace: 'pre-line' 
//           }}>
//             {p.description}
//           </div>
//         ),
//           moduleName: p.moduleDtoList ? p.moduleDtoList.moduleName : 'No Module Name',
//           // url: p.url,
//           videoUrl: p.videoUrl,
//           file: p.filePath === null ? (
//             'NO FILE FOUND'
//           ) : (
//             <img src={ImageUrl + p.filePath} alt={p.fileName} style={{ width: 100, height: 50 }} />
//           ),
//           insertedDate: moment(p.insertedDate).format('L'),
//           updatedDate: moment(p.updatedDate).format('L'),
//           createdBy: p.createdBy ? p.createdBy.userName : 'No User',
//           updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
//         }))
//                 .sort((a, b) => a.topicId - b.topicId); // For ascending by ID

//         setTopics(tableData);
//       } else {
//         setTopics([]);
//       }
//     } catch (error) {
//       console.error('Error fetching topics:', error);
//     }
//   };

//   const fetchModules = async () => {
//     try {
//       const res = await fetchAllModules(headers);
//       const fetchedData = res.data;
//       if (fetchedData) {
//         const sortedData = fetchedData.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
//         setModules(sortedData);
//       }
//     } catch (error) {
//       console.error('Error fetching modules:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchModules();
//   }, [refreshTrigger]);

//   const validateForm = () => {
//     const newErrors = {};

//     if (!userdata.topicName || userdata.topicName.trim() === '') {
//       newErrors.topicName = 'Enter the topic name';
//     }

//     if (!userdata.description || userdata.description.trim() === '') {
//       newErrors.description = 'Enter the description';
//     }

//     if (!userdata.videoUrl || userdata.videoUrl.trim() === '') {
//       newErrors.videoUrl = 'Enter the video URL';
//     }

//     // if (!userdata.url || userdata.url.trim() === '') {
//     //   newErrors.url = 'Enter the URL';
//     // }

//     if (!userdata.moduleId) {
//       newErrors.moduleId = 'Select a module';
//     }

//     if (!userdata.fileName || userdata.fileName.trim() === '') {
//       newErrors.fileName = 'Select the file';
//     }

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

//   const handleAddTopic = () => {
//     setEditMode(false);
//     setUserData({
//       topicName: '',
//       description: '',
//       moduleId: '',
//       videoUrl: '',
//       // url: '',
//       fileName: ''
//     });
//     setOpen(true);
//   };

//   const onFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setSelectedFile(selectedFile);
//     setFileName(selectedFile ? selectedFile.name : '');
//   };

//   const onFileUpload = async (e) => {
//     e.preventDefault();
//     if (!selectedFile) {
//       setFileError('Please select a file');
//       Swal.fire({
//         icon: 'error',
//         title: 'No file selected',
//         text: 'Please select a file to upload',
//         confirmButtonColor: theme.palette.primary.main
//       });
//       return;
//     }

//     const data = new FormData();
//     data.append('file', selectedFile);

//     try {
//       // Show loading indicator
//       Swal.fire({
//         title: 'Uploading file...',
//         allowOutsideClick: false,
//         didOpen: () => {
//           Swal.showLoading();
//         }
//       });

//       const res = await axios.post(`${BaseUrl}/file/uploadFile`, data, {
//         headers: {
//           'content-type': 'multipart/form-data',
//           Authorization: 'Bearer ' + user.accessToken
//         }
//       });

//       // Close loading indicator
//       Swal.close();

//       if (res.status === 200) {
//         setUserData((prevData) => ({
//           ...prevData,
//           fileName: res.data.fileName
//         }));
//         setFileError('');
//         Swal.fire({
//           icon: 'success',
//           title: 'Success!',
//           text: res.data.message,
//           showConfirmButton: false,
//           timer: 1500,
//           background: theme.palette.background.default,
//           color: theme.palette.text.primary
//         });
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Upload failed',
//           text: res.data.errorMessage,
//           confirmButtonColor: theme.palette.primary.main
//         });
//       }
//     } catch (err) {
//       console.log('Error uploading file:', err);
//       Swal.fire({
//         icon: 'error',
//         title: 'Upload error',
//         text: 'An error occurred while uploading the file',
//         confirmButtonColor: theme.palette.primary.main
//       });
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
//       moduleDtoList: { moduleId: userdata.moduleId },
//       createdBy: { userId: user.userId }
//     };

//     try {
//       const response = await addTopic(dataToPost, headers);
//       if (response.data.responseCode === 201) {
//         setRefreshTrigger(!refreshTrigger);
//         setOpen(false);
//         fetchData();
//       } else {
//         alert(response.data.errorMessage);
//       }
//     } catch (error) {
//       console.error('Error posting topic:', error);
//     }
//     fetchData()
//     setOpen(false)
//   };

//   const handleEdit = async (topicId) => {
//     setEditMode(true);
//     setOpen(true);
//     try {
//       const res = await fetchTopicById(topicId, headers);
//       const det = res.data;
//       setTopicId(det.topicId);

//       setUserData({
//         topicName: det.topicName,
//         description: det.description,
//         // url: det.url,
//         videoUrl: det.videoUrl,
//         fileName: det.fileName,
//         moduleId: det.moduleDtoList ? det.moduleDtoList.moduleId : ''
//       });
//     } catch (error) {
//       console.error('Error fetching topic details:', error);
//     }

//   };

//   const updateData = async (e) => {
//     e.preventDefault();

//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     const updatedDataPayload = {
//       topicId,
//       topicName: userdata.topicName,
//       description: userdata.description,
//       // url: userdata.url,
//       videoUrl: userdata.videoUrl,
//       fileName: userdata.fileName,
//       moduleDtoList: { moduleId: userdata.moduleId },
//       updatedBy: { userId: user.userId }
//     };

//     try {
//       const response = await updatedTopic(updatedDataPayload, headers);
//       if (response.data.responseCode === 200) {
//         alert(response.data.message);
//         setRefreshTrigger(!refreshTrigger);
//         setOpen(false);
//       } else {
//         alert(response.data.errorMessage);
//       }
//     } catch (error) {
//       console.error('Error updating topic:', error);
//     }
//     fetchData()
//     setOpen(false)
//   };

//   const deleteData = async (topicId) => {
//     if (window.confirm('Are you sure you want to delete this topic?')) {
//       try {
//         const response = await deleteTopic(topicId, headers);
//         if (response.data.responseCode === 200) {
//           alert(response.data.message);
//           setRefreshTrigger(!refreshTrigger);
//           fetchData();
//         } else {
//           alert(response.data.errorMessage);
//         }
//       } catch (error) {
//         console.error('Error deleting topic:', error);
//       }
//     }
//   };

//   const handleCloseDialog = () => {
//     setOpen(false);
//     setFileName('');
//     setSelectedFile(null);
//     setFileError('');
//   };

//   const handlePageChange = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <>
//       <MainCard
//         title={
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <span>Topic</span>
//             <Button
//               variant="contained"
//               color="primary"
//               sx={{
//                 display: 'flex', alignItems: 'center', fontSize: '15px', backgroundColor: "#03045E",
//                 '&:hover': {
//                   backgroundColor: "#03045E",
//                   opacity: 0.9
//                 }
//               }}
//               onClick={handleAddTopic}
//             >
//               Add
//               <AddIcon sx={{ color: '#fff' }} />
//             </Button>
//           </Box>
//         }
//       >
//         <TableContainer component={Paper}>
//           <Table sx={{ minWidth: 650 }} aria-labelledby="tableTitle">
//             <TableHead>
//               <TableRow>
//                 {columns.map((column) => (
//                   <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
//                     {column.label}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             {/* <TableBody>
//               {topics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((topic, index) => {
//                 return (
//                   <TableRow hover role="checkbox" tabIndex={-1} key={topic.topicId}>
//                     <TableCell>{topic.topicId}</TableCell>
//                     <TableCell>{topic.topicName}</TableCell>
//                     <TableCell>{topic.description}</TableCell>
//                     <TableCell>{topic.moduleName}</TableCell>
//                     <TableCell>{topic.url}</TableCell>
//                     <TableCell>{topic.videoUrl}</TableCell>
//                     <TableCell>{topic.file}</TableCell>
//                     <TableCell align="right">{topic.createdBy}</TableCell>
//                     <TableCell align="right">{topic.updatedBy}</TableCell>
//                     <TableCell align="right">{topic.insertedDate}</TableCell>
//                     <TableCell align="right">{topic.updatedDate}</TableCell>
//                     <TableCell align="right">
//                       <IconButton onClick={() => handleEdit(topic.topicId)} sx={{ color: "#03045E" }} size="small">
//                         <Edit />
//                       </IconButton>
//                       <IconButton onClick={() => deleteData(topic.topicId)} color="error" size="small">
//                         <DeleteForever />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody> */}

//             {/* <TableBody>
//   {topics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((topic, index) => {
//     return (
//       <TableRow hover role="checkbox" tabIndex={-1} key={topic.topicId}>
//         <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//         <TableCell>{topic.topicName}</TableCell>
//         <TableCell>{topic.description}</TableCell>
//         <TableCell>{topic.moduleName}</TableCell>
//         <TableCell>{topic.url}</TableCell>
//         <TableCell>{topic.videoUrl}</TableCell>
//         <TableCell>{topic.file}</TableCell>
//         <TableCell align="right">{topic.createdBy}</TableCell>
//         <TableCell align="right">{topic.updatedBy}</TableCell>
//         <TableCell align="right">{topic.insertedDate}</TableCell>
//         <TableCell align="right">{topic.updatedDate}</TableCell>
//         <TableCell align="right">
//           <IconButton onClick={() => handleEdit(topic.topicId)} sx={{ color: "#03045E" }} size="small">
//             <Edit />
//           </IconButton>
//           <IconButton onClick={() => deleteData(topic.topicId)} color="error" size="small">
//             <DeleteForever />
//           </IconButton>
//         </TableCell>
//       </TableRow>
//     );
//   })}
// </TableBody> */}
// <TableBody>
//   {topics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((topic) => {
//     return (
//       <TableRow hover role="checkbox" tabIndex={-1} key={topic.topicId}>
//         <TableCell>{topic.topicId}</TableCell>
//         <TableCell>{topic.topicName}</TableCell>
//         <TableCell>{topic.description}</TableCell>
//         <TableCell>{topic.moduleName}</TableCell>
//         {/* <TableCell>{topic.urloo}</TableCell> */}
//         <TableCell>{topic.videoUrl}</TableCell>
//         <TableCell>{topic.file}</TableCell>
//         <TableCell align="right">{topic.createdBy}</TableCell>
//         <TableCell align="right">{topic.updatedBy}</TableCell>
//         <TableCell align="right">{topic.insertedDate}</TableCell>
//         <TableCell align="right">{topic.updatedDate}</TableCell>
//         <TableCell align="right">
//           <IconButton onClick={() => handleEdit(topic.topicId)} sx={{ color: "#03045E" }} size="small">
//             <Edit />
//           </IconButton>
//           <IconButton onClick={() => deleteData(topic.topicId)} color="error" size="small">
//             <DeleteForever />
//           </IconButton>
//         </TableCell>
//       </TableRow>
//     );
//   })}
// </TableBody>
//           </Table>
//         </TableContainer>

//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={topics.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handlePageChange}
//           onRowsPerPageChange={handleRowsPerPageChange}
//         />
//       </MainCard>
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
//         <Box component="form" onSubmit={editMode ? updateData : postData} noValidate sx={{ p: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Topic Name"
//                 name="topicName"
//                 value={userdata.topicName}
//                 onChange={changeHandler}
//                 error={!!errors.topicName}
//                 helperText={errors.topicName}
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
//             <Grid item xs={12}  >
//               <FormControl fullWidth error={!!errors.moduleId} sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '&.Mui-focused fieldset': {
//                     borderColor: '#03045E',
//                   },
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': {
//                   color: '#03045E',
//                 },
//               }}>
//                 <InputLabel id="module-select">Module</InputLabel>
//                 <Select labelId="module-select" name="moduleId" value={userdata.moduleId} onChange={changeHandler}>
//                   {modules.map((module) => (
//                     <MenuItem key={module.moduleId} value={module.moduleId}>
//                       {module.moduleName}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 <FormHelperText>{errors.moduleId}</FormHelperText>
//               </FormControl>
//             </Grid>
//             {/* <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Url "
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
//             </Grid> */}
//             {/* <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Upload Content Video "
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
//             </Grid> */}
// <Grid item xs={12} md={6}>
//               <TextField
//                 margin="normal"
//                 fullWidth
//                 id="file"
//                 label="Upload pdf"
//                 name="fileName"
//                 value={userdata.fileName}
//                 disabled
//                 helperText={errors.fileName}
//                 error={!!errors.fileName}
//                 InputProps={{
//                   endAdornment: (
//                     <Button variant="contained" color="primary" onClick={onFileUpload} sx={{
//                       backgroundColor: "#03045E",
//                       '&:hover': {
//                         backgroundColor: "#03045E",
//                         opacity: 0.9
//                       }
//                     }}>
//                       Upload
//                     </Button>
//                   )
//                 }}
//               />

//               <input
//                 type="file"
//                 onChange={onFileChange}
//                 ref={inputRef}
//                 style={{ marginTop: 20 }}
//                 accept="application/pdf"
//               />
//             </Grid>
// {/* ------------ */}
//             <Grid item xs={12} md={6}>
//               <TextField
//                 margin="normal"
//                 fullWidth
//                 id="fileName"
//                 label="Upload Context Video"
//                 name="fileName"
//                 value={userdata.fileName}
//                 disabled
//                 helperText={errors.fileName}
//                 error={!!errors.fileName}
//                 InputProps={{
//                   endAdornment: (
//                     <Button variant="contained" color="primary" onClick={onFileUpload} sx={{
//                       backgroundColor: "#03045E",
//                       '&:hover': {
//                         backgroundColor: "#03045E",
//                         opacity: 0.9
//                       }
//                     }}>
//                       Upload
//                     </Button>
//                   )
//                 }}
//               />

//               <input
//                 type="file"
//                 onChange={onFileChange}
//                 ref={inputRef}
//                 style={{ marginTop: 20 }}
//                  accept="video/mp4, video/x-m4v"
//               />
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
//     </>
//   );
// };

// export default AcademyTopics;   

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
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import { addTopic, deleteTopic, fetchAllModules, fetchTopics, fetchTopicById, updatedTopic } from 'views/API/TopicApi';
import { BaseUrl } from 'BaseUrl';
import axios from 'axios';
import Swal from 'sweetalert2';

const columns = [
  { id: 'topicId', label: 'ID' },
  { id: 'topicName', label: 'Name', minWidth: 150 },
  { id: 'description', label: 'Description', minWidth: 450 },
  { id: 'moduleName', label: 'Module', minWidth: 150 },
  { id: 'videoUrl', label: 'Context Video' },
  { id: 'file', label: 'PDF File', minWidth: 200 },
  { id: 'createdBy', label: 'Created By', align: 'right' },
  { id: 'updatedBy', label: 'Updated By', align: 'right' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
  { id: 'updatedDate', label: 'Updated Date', align: 'right' },
  { id: 'actions', label: 'Actions', align: 'right' }
];

const AcademyTopics = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [topics, setTopics] = useState([]);
  const [modules, setModules] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userdata, setUserData] = useState({
    topicName: '',
    description: '',
    moduleId: '',
    videoUrl: '',
    pdfFileName: '',
    videoFileName: ''
  });
  const [errors, setErrors] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [topicId, setTopicId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const inputRef = useRef(null);

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };
  const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

  // Fetch topics
  const fetchData = async () => {
    try {
      const res = await fetchTopics(headers);
      const fetchedData = res.data.content;
      if (fetchedData) {
        const tableData = fetchedData.map((p) => ({
          topicId: p.topicId,
          topicName: p.topicName,
          description: (
            <div style={{ textAlign: 'justify', whiteSpace: 'pre-line' }}>
              {p.description}
            </div>
          ),
          moduleName: p.moduleDtoList ? p.moduleDtoList.moduleName : 'No Module',
          videoUrl: p.videoUrl,
          file: p.filePath
            ? <img src={ImageUrl + p.filePath} alt={p.fileName} style={{ width: 100, height: 50 }} />
            : 'NO FILE FOUND',
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy?.userName || 'No User',
          updatedBy: p.updatedBy?.userName || 'No User'
        })).sort((a, b) => a.topicId - b.topicId);
        setTopics(tableData);
      } else setTopics([]);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchModules = async () => {
    try {
      const res = await fetchAllModules(headers);
      setModules(res.data.sort((a, b) => a.moduleName.localeCompare(b.moduleName)));
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchModules();
  }, [refreshTrigger]);

  const validateForm = () => {
    const newErrors = {};
    if (!userdata.topicName?.trim()) newErrors.topicName = 'Enter the topic name';
    if (!userdata.description?.trim()) newErrors.description = 'Enter the description';
    if (!userdata.videoUrl?.trim()) newErrors.videoUrl = 'Enter the video URL';
    if (!userdata.moduleId) newErrors.moduleId = 'Select a module';
    return newErrors;
  };

  const changeHandler = (e) => {
    setUserData({ ...userdata, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleAddTopic = () => {
    setEditMode(false);
    setUserData({ topicName: '', description: '', moduleId: '', videoUrl: '', pdfFileName: '', videoFileName: '' });
    setOpen(true);
  };

  const onFileChange = (e, type) => {
    setSelectedFile(e.target.files[0]);
    setFileType(type);
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      Swal.fire({ icon: 'error', title: 'No file selected', text: 'Please select a file', confirmButtonColor: theme.palette.primary.main });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      Swal.fire({ title: 'Uploading...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const res = await axios.post(`${BaseUrl}/file/uploadFile`, formData, {
        headers: { 'Content-type': 'multipart/form-data', Authorization: 'Bearer ' + user.accessToken }
      });
      Swal.close();

      if (res.status === 200) {
        if (fileType === 'pdf') {
          setUserData(prev => ({ ...prev, pdfFileName: res.data.fileName }));
        } else if (fileType === 'video') {
          setUserData(prev => ({ ...prev, videoFileName: res.data.fileName }));
        }
        Swal.fire({ icon: 'success', title: 'File uploaded successfully', showConfirmButton: false, timer: 1500 });
      }
    } catch (err) {
      Swal.close();
      Swal.fire({ icon: 'error', title: 'Upload failed', text: 'Please try again', confirmButtonColor: theme.palette.primary.main });
      console.error(err);
    }
  };

  const postData = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const payload = {
      ...userdata,
      moduleDtoList: { moduleId: userdata.moduleId },
      createdBy: { userId: user.userId }
    };
    try {
      const res = await addTopic(payload, headers);
      if (res.data.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
      } else alert(res.data.errorMessage);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (topicId) => {
    setEditMode(true);
    setOpen(true);
    try {
      const res = await fetchTopicById(topicId, headers);
      const det = res.data;
      setTopicId(det.topicId);
      setUserData({
        topicName: det.topicName,
        description: det.description,
        videoUrl: det.videoUrl,
        pdfFileName: det.fileName,
        videoFileName: det.videoFileName || '',
        moduleId: det.moduleDtoList?.moduleId || ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateData = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const payload = {
      topicId,
      ...userdata,
      moduleDtoList: { moduleId: userdata.moduleId },
      updatedBy: { userId: user.userId }
    };
    try {
      const res = await updatedTopic(payload, headers);
      if (res.data.responseCode === 200) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
      } else alert(res.data.errorMessage);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteData = async (topicId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const res = await deleteTopic(topicId, headers);
      if (res.data.responseCode === 200) setRefreshTrigger(!refreshTrigger);
      else alert(res.data.errorMessage);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <MainCard
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Topic</span>
            <Button variant="contained" onClick={handleAddTopic} sx={{ backgroundColor: '#03045E', '&:hover': { opacity: 0.9 } }}>
              Add <AddIcon sx={{ color: '#fff' }} />
            </Button>
          </Box>
        }
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map(col => (
                  <TableCell key={col.id} align={col.align} style={{ minWidth: col.minWidth }}>{col.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {topics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(topic => (
                <TableRow hover key={topic.topicId}>
                  <TableCell>{topic.topicId}</TableCell>
                  <TableCell>{topic.topicName}</TableCell>
                  <TableCell>{topic.description}</TableCell>
                  <TableCell>{topic.moduleName}</TableCell>
                  <TableCell>{topic.videoUrl}</TableCell>
                  <TableCell>{topic.file}</TableCell>
                  <TableCell align="right">{topic.createdBy}</TableCell>
                  <TableCell align="right">{topic.updatedBy}</TableCell>
                  <TableCell align="right">{topic.insertedDate}</TableCell>
                  <TableCell align="right">{topic.updatedDate}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(topic.topicId)}><Edit /></IconButton>
                    <IconButton onClick={() => deleteData(topic.topicId)} color="error"><DeleteForever /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          count={topics.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </MainCard>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editMode ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
        <Box component="form" onSubmit={editMode ? updateData : postData} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Topic Name" name="topicName" value={userdata.topicName} onChange={changeHandler} error={!!errors.topicName} helperText={errors.topicName} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" name="description" value={userdata.description} onChange={changeHandler} error={!!errors.description} helperText={errors.description} multiline rows={3} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.moduleId}>
                <InputLabel>Module</InputLabel>
                <Select name="moduleId" value={userdata.moduleId} onChange={changeHandler}>
                  {modules.map(mod => <MenuItem key={mod.moduleId} value={mod.moduleId}>{mod.moduleName}</MenuItem>)}
                </Select>
                <FormHelperText>{errors.moduleId}</FormHelperText>
              </FormControl>
            </Grid>

            {/* PDF Upload */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="PDF File"
                value={userdata.pdfFileName}
                disabled
                InputProps={{
                  endAdornment: <Button variant="contained" onClick={uploadFile}>Upload</Button>
                }}
              />
              <input type="file" ref={inputRef} style={{ marginTop: 10 }} accept="application/pdf" onChange={e => onFileChange(e, 'pdf')} />
            </Grid>

            {/* Video Upload */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Context Video"
                value={userdata.videoFileName}
                disabled
                InputProps={{
                  endAdornment: <Button variant="contained" onClick={uploadFile}>Upload</Button>
                }}
              />
              <input type="file" ref={inputRef} style={{ marginTop: 10 }} accept="video/mp4,video/x-m4v" onChange={e => onFileChange(e, 'video')} />
            </Grid>

          </Grid>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editMode ? 'Update' : 'Save'}</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default AcademyTopics;
