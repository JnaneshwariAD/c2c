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
//   { id: 'videoUrl', label: 'Context Video' },
//   { id: 'file', label: 'PDF File', minWidth: 200 },
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
//     pdfFileName: '',
//     videoFileName: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [refreshTrigger, setRefreshTrigger] = useState(false);
//   const [topicId, setTopicId] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [fileType, setFileType] = useState('');
//   const inputRef = useRef(null);

//   const user = JSON.parse(sessionStorage.getItem('user'));
//   const headers = {
//     'Content-type': 'application/json',
//     Authorization: 'Bearer ' + user.accessToken
//   };
//   const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

//   // Fetch topics
//   const fetchData = async () => {
//     try {
//       const res = await fetchTopics(headers);
//       const fetchedData = res.data.content;
//       if (fetchedData) {
//         const tableData = fetchedData.map((p) => ({
//           topicId: p.topicId,
//           topicName: p.topicName,
//           description: (
//             <div style={{ textAlign: 'justify', whiteSpace: 'pre-line' }}>
//               {p.description}
//             </div>
//           ),
//           moduleName: p.moduleDtoList ? p.moduleDtoList.moduleName : 'No Module',
//           videoUrl: p.videoUrl,
//           file: p.filePath
//             ? <img src={ImageUrl + p.filePath} alt={p.fileName} style={{ width: 100, height: 50 }} />
//             : 'NO FILE FOUND',
//           insertedDate: moment(p.insertedDate).format('L'),
//           updatedDate: moment(p.updatedDate).format('L'),
//           createdBy: p.createdBy?.userName || 'No User',
//           updatedBy: p.updatedBy?.userName || 'No User'
//         })).sort((a, b) => a.topicId - b.topicId);
//         setTopics(tableData);
//       } else setTopics([]);
//     } catch (error) {
//       console.error('Error fetching topics:', error);
//     }
//   };

//   const fetchModules = async () => {
//     try {
//       const res = await fetchAllModules(headers);
//       setModules(res.data.sort((a, b) => a.moduleName.localeCompare(b.moduleName)));
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
//     if (!userdata.topicName?.trim()) newErrors.topicName = 'Enter the topic name';
//     if (!userdata.description?.trim()) newErrors.description = 'Enter the description';
//     if (!userdata.videoUrl?.trim()) newErrors.videoUrl = 'Enter the video URL';
//     if (!userdata.moduleId) newErrors.moduleId = 'Select a module';
//     return newErrors;
//   };

//   const changeHandler = (e) => {
//     setUserData({ ...userdata, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: null });
//   };

//   const handleAddTopic = () => {
//     setEditMode(false);
//     setUserData({ topicName: '', description: '', moduleId: '', videoUrl: '', pdfFileName: '', videoFileName: '' });
//     setOpen(true);
//   };

//   const onFileChange = (e, type) => {
//     setSelectedFile(e.target.files[0]);
//     setFileType(type);
//   };

//   const uploadFile = async () => {
//     if (!selectedFile) {
//       Swal.fire({ icon: 'error', title: 'No file selected', text: 'Please select a file', confirmButtonColor: theme.palette.primary.main });
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     try {
//       Swal.fire({ title: 'Uploading...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
//       const res = await axios.post(`${BaseUrl}/file/uploadFile`, formData, {
//         headers: { 'Content-type': 'multipart/form-data', Authorization: 'Bearer ' + user.accessToken }
//       });
//       Swal.close();

//       if (res.status === 200) {
//         if (fileType === 'pdf') {
//           setUserData(prev => ({ ...prev, pdfFileName: res.data.fileName }));
//         } else if (fileType === 'video') {
//           setUserData(prev => ({ ...prev, videoFileName: res.data.fileName }));
//         }
//         Swal.fire({ icon: 'success', title: 'File uploaded successfully', showConfirmButton: false, timer: 1500 });
//       }
//     } catch (err) {
//       Swal.close();
//       Swal.fire({ icon: 'error', title: 'Upload failed', text: 'Please try again', confirmButtonColor: theme.palette.primary.main });
//       console.error(err);
//     }
//   };

//   const postData = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     const payload = {
//       ...userdata,
//       moduleDtoList: { moduleId: userdata.moduleId },
//       createdBy: { userId: user.userId }
//     };
//     try {
//       const res = await addTopic(payload, headers);
//       if (res.data.responseCode === 201) {
//         setRefreshTrigger(!refreshTrigger);
//         setOpen(false);
//       } else alert(res.data.errorMessage);
//     } catch (err) {
//       console.error(err);
//     }
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
//         videoUrl: det.videoUrl,
//         pdfFileName: det.fileName,
//         videoFileName: det.videoFileName || '',
//         moduleId: det.moduleDtoList?.moduleId || ''
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateData = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     const payload = {
//       topicId,
//       ...userdata,
//       moduleDtoList: { moduleId: userdata.moduleId },
//       updatedBy: { userId: user.userId }
//     };
//     try {
//       const res = await updatedTopic(payload, headers);
//       if (res.data.responseCode === 200) {
//         setRefreshTrigger(!refreshTrigger);
//         setOpen(false);
//       } else alert(res.data.errorMessage);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const deleteData = async (topicId) => {
//     if (!window.confirm('Are you sure?')) return;
//     try {
//       const res = await deleteTopic(topicId, headers);
//       if (res.data.responseCode === 200) setRefreshTrigger(!refreshTrigger);
//       else alert(res.data.errorMessage);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <>
//       <MainCard
//         title={
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <span>Topic</span>
//             <Button variant="contained" onClick={handleAddTopic} sx={{ backgroundColor: '#03045E', '&:hover': { opacity: 0.9 } }}>
//               Add <AddIcon sx={{ color: '#fff' }} />
//             </Button>
//           </Box>
//         }
//       >
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 {columns.map(col => (
//                   <TableCell key={col.id} align={col.align} style={{ minWidth: col.minWidth }}>{col.label}</TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {topics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(topic => (
//                 <TableRow hover key={topic.topicId}>
//                   <TableCell>{topic.topicId}</TableCell>
//                   <TableCell>{topic.topicName}</TableCell>
//                   <TableCell>{topic.description}</TableCell>
//                   <TableCell>{topic.moduleName}</TableCell>
//                   <TableCell>{topic.videoUrl}</TableCell>
//                   <TableCell>{topic.file}</TableCell>
//                   <TableCell align="right">{topic.createdBy}</TableCell>
//                   <TableCell align="right">{topic.updatedBy}</TableCell>
//                   <TableCell align="right">{topic.insertedDate}</TableCell>
//                   <TableCell align="right">{topic.updatedDate}</TableCell>
//                   <TableCell align="right">
//                     <IconButton onClick={() => handleEdit(topic.topicId)}><Edit /></IconButton>
//                     <IconButton onClick={() => deleteData(topic.topicId)} color="error"><DeleteForever /></IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           count={topics.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={(e, p) => setPage(p)}
//           onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
//         />
//       </MainCard>

//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle>{editMode ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
//         <Box component="form" onSubmit={editMode ? updateData : postData} sx={{ p: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField fullWidth label="Topic Name" name="topicName" value={userdata.topicName} onChange={changeHandler} error={!!errors.topicName} helperText={errors.topicName} />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField fullWidth label="Description" name="description" value={userdata.description} onChange={changeHandler} error={!!errors.description} helperText={errors.description} multiline rows={3} />
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth error={!!errors.moduleId}>
//                 <InputLabel>Module</InputLabel>
//                 <Select name="moduleId" value={userdata.moduleId} onChange={changeHandler}>
//                   {modules.map(mod => <MenuItem key={mod.moduleId} value={mod.moduleId}>{mod.moduleName}</MenuItem>)}
//                 </Select>
//                 <FormHelperText>{errors.moduleId}</FormHelperText>
//               </FormControl>
//             </Grid>

//             {/* PDF Upload */}
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="PDF File"
//                 value={userdata.pdfFileName}
//                 disabled
//                 InputProps={{
//                   endAdornment: <Button variant="contained" onClick={uploadFile}>Upload</Button>
//                 }}
//               />
//               <input type="file" ref={inputRef} style={{ marginTop: 10 }} accept="application/pdf" onChange={e => onFileChange(e, 'pdf')} />
//             </Grid>

//             {/* Video Upload */}
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Context Video"
//                 value={userdata.videoFileName}
//                 disabled
//                 InputProps={{
//                   endAdornment: <Button variant="contained" onClick={uploadFile}>Upload</Button>
//                 }}
//               />
//               <input type="file" ref={inputRef} style={{ marginTop: 10 }} accept="video/mp4,video/x-m4v" onChange={e => onFileChange(e, 'video')} />
//             </Grid>

//           </Grid>
//           <DialogActions>
//             <Button onClick={() => setOpen(false)}>Cancel</Button>
//             <Button type="submit" variant="contained">{editMode ? 'Update' : 'Save'}</Button>
//           </DialogActions>
//         </Box>
//       </Dialog>
//     </>
//   );
// };

// export default AcademyTopics;



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
//   Select,
//   ToggleButtonGroup,
//   ToggleButton
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
// import MainCard from 'ui-component/cards/MainCard';
// import { useState, useEffect, useRef } from 'react';
// import moment from 'moment';
// import { useTheme } from '@mui/material/styles';
// import { addTopic, deleteTopic, fetchAllModules, fetchTopics, fetchTopicById, updatedTopic } from 'views/API/TopicApi';
// import { BaseUrl } from 'BaseUrl';
// import axios from 'axios';
// import Swal from 'sweetalert2';

// // ✅ Import TopicCards component (you'll need to create this)
// import TopicCards from './TopicCards';

// const columns = [
//   { id: 'topicId', label: 'ID' },
//   { id: 'topicName', label: 'Name', minWidth: 150 },
//   { id: 'description', label: 'Description', minWidth: 450 },
//   { id: 'moduleName', label: 'Module', minWidth: 150 },
//   { id: 'videoUrl', label: 'Context Video' },
//   { id: 'file', label: 'PDF File', minWidth: 200 },
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
//   const [viewMode, setViewMode] = useState('list'); // ✅ Added view mode toggle
//   const [userdata, setUserData] = useState({
//     topicName: '',
//     description: '',
//     moduleId: '',
//     videoUrl: '',
//     pdfFileName: '',
//     videoFileName: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [refreshTrigger, setRefreshTrigger] = useState(false);
//   const [topicId, setTopicId] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [fileType, setFileType] = useState('');
//   const inputRef = useRef(null);

//   const user = JSON.parse(sessionStorage.getItem('user'));
//   const headers = {
//     'Content-type': 'application/json',
//     Authorization: 'Bearer ' + user.accessToken
//   };
//   const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

//   // Fetch topics
//   const fetchData = async () => {
//     try {
//       const res = await fetchTopics(headers);
//       const fetchedData = res.data.content;
//       if (fetchedData) {
//         const tableData = fetchedData.map((p) => ({
//           topicId: p.topicId,
//           topicName: p.topicName,
//           description: p.description, // ✅ Removed JSX for card compatibility
//           moduleName: p.moduleDtoList ? p.moduleDtoList.moduleName : 'No Module',
//           videoUrl: p.videoUrl,
//           filePath: p.filePath, // ✅ Added for card view
//           fileName: p.fileName, // ✅ Added for card view
//           insertedDate: moment(p.insertedDate).format('L'),
//           updatedDate: moment(p.updatedDate).format('L'),
//           createdBy: p.createdBy?.userName || 'No User',
//           updatedBy: p.updatedBy?.userName || 'No User'
//         })).sort((a, b) => a.topicId - b.topicId);
//         setTopics(tableData);
//       } else setTopics([]);
//     } catch (error) {
//       console.error('Error fetching topics:', error);
//     }
//   };

//   const fetchModules = async () => {
//     try {
//       const res = await fetchAllModules(headers);
//       setModules(res.data.sort((a, b) => a.moduleName.localeCompare(b.moduleName)));
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
//     if (!userdata.topicName?.trim()) newErrors.topicName = 'Enter the topic name';
//     if (!userdata.description?.trim()) newErrors.description = 'Enter the description';
//     if (!userdata.videoUrl?.trim()) newErrors.videoUrl = 'Enter the video URL';
//     if (!userdata.moduleId) newErrors.moduleId = 'Select a module';
//     return newErrors;
//   };

//   const changeHandler = (e) => {
//     setUserData({ ...userdata, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: null });
//   };

//   const handleAddTopic = () => {
//     setEditMode(false);
//     setUserData({ topicName: '', description: '', moduleId: '', videoUrl: '', pdfFileName: '', videoFileName: '' });
//     setOpen(true);
//   };

//   const onFileChange = (e, type) => {
//     setSelectedFile(e.target.files[0]);
//     setFileType(type);
//   };

//   const uploadFile = async () => {
//     if (!selectedFile) {
//       Swal.fire({ icon: 'error', title: 'No file selected', text: 'Please select a file', confirmButtonColor: theme.palette.primary.main });
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     try {
//       Swal.fire({ title: 'Uploading...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
//       const res = await axios.post(`${BaseUrl}/file/uploadFile`, formData, {
//         headers: { 'Content-type': 'multipart/form-data', Authorization: 'Bearer ' + user.accessToken }
//       });
//       Swal.close();

//       if (res.status === 200) {
//         if (fileType === 'pdf') {
//           setUserData(prev => ({ ...prev, pdfFileName: res.data.fileName }));
//         } else if (fileType === 'video') {
//           setUserData(prev => ({ ...prev, videoFileName: res.data.fileName }));
//         }
//         Swal.fire({ icon: 'success', title: 'File uploaded successfully', showConfirmButton: false, timer: 1500 });
//       }
//     } catch (err) {
//       Swal.close();
//       Swal.fire({ icon: 'error', title: 'Upload failed', text: 'Please try again', confirmButtonColor: theme.palette.primary.main });
//       console.error(err);
//     }
//   };

//   const postData = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     const payload = {
//       ...userdata,
//       moduleDtoList: { moduleId: userdata.moduleId },
//       createdBy: { userId: user.userId }
//     };
//     try {
//       const res = await addTopic(payload, headers);
//       if (res.data.responseCode === 201) {
//         setRefreshTrigger(!refreshTrigger);
//         setOpen(false);
//       } else alert(res.data.errorMessage);
//     } catch (err) {
//       console.error(err);
//     }
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
//         videoUrl: det.videoUrl,
//         pdfFileName: det.fileName,
//         videoFileName: det.videoFileName || '',
//         moduleId: det.moduleDtoList?.moduleId || ''
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateData = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     const payload = {
//       topicId,
//       ...userdata,
//       moduleDtoList: { moduleId: userdata.moduleId },
//       updatedBy: { userId: user.userId }
//     };
//     try {
//       const res = await updatedTopic(payload, headers);
//       if (res.data.responseCode === 200) {
//         setRefreshTrigger(!refreshTrigger);
//         setOpen(false);
//       } else alert(res.data.errorMessage);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const deleteData = async (topicId) => {
//     if (!window.confirm('Are you sure?')) return;
//     try {
//       const res = await deleteTopic(topicId, headers);
//       if (res.data.responseCode === 200) setRefreshTrigger(!refreshTrigger);
//       else alert(res.data.errorMessage);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <MainCard
//       title={
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <span>Topic</span>
//           <Box display="flex" alignItems="center" gap={1}>
//             <ToggleButtonGroup
//               value={viewMode}
//               exclusive
//               onChange={(e, val) => val && setViewMode(val)}
//               size="small"
//             >
//               <ToggleButton value="list">
//                 <ViewList />
//               </ToggleButton>
//               <ToggleButton value="card">
//                 <ViewModule />
//               </ToggleButton>
//             </ToggleButtonGroup>
//             <Button 
//               variant="contained" 
//               onClick={handleAddTopic} 
//               sx={{ backgroundColor: '#03045E', '&:hover': { opacity: 0.9 } }}
//             >
//               Add <AddIcon sx={{ color: '#fff' }} />
//             </Button>
//           </Box>
//         </Box>
//       }
//     >
//       {viewMode === 'list' ? (
//         <Paper>
//           <TableContainer sx={{ maxHeight: 440 }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   {columns.map((col) => (
//                     <TableCell key={col.id} align={col.align} style={{ minWidth: col.minWidth }}>
//                       {col.label}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {topics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((topic) => (
//                   <TableRow hover key={topic.topicId}>
//                     {columns.map((col) => (
//                       <TableCell key={col.id} align={col.align}>
//                         {col.id === 'actions' ? (
//                           <>
//                             <IconButton onClick={() => handleEdit(topic.topicId)} color="primary">
//                               <Edit />
//                             </IconButton>
//                             <IconButton onClick={() => deleteData(topic.topicId)} color="error">
//                               <DeleteForever />
//                             </IconButton>
//                           </>
//                         ) : col.id === 'file' ? (
//                           topic.filePath ? (
//                             <img src={ImageUrl + topic.filePath} alt={topic.fileName} style={{ width: 100, height: 50 }} />
//                           ) : (
//                             'NO FILE FOUND'
//                           )
//                         ) : col.id === 'description' ? (
//                           <div style={{ textAlign: 'justify', whiteSpace: 'pre-line' }}>
//                             {topic[col.id]}
//                           </div>
//                         ) : (
//                           topic[col.id]
//                         )}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={topics.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={(e, newPage) => setPage(newPage)}
//             onRowsPerPageChange={(e) => {
//               setRowsPerPage(+e.target.value);
//               setPage(0);
//             }}
//           />
//         </Paper>
//       ) : (
//         <TopicCards
//           topics={topics}
//           page={page}
//           rowsPerPage={rowsPerPage}
//           onEdit={handleEdit}
//           onDelete={deleteData}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(+e.target.value);
//             setPage(0);
//           }}
//           ImageUrl={ImageUrl}
//         />
//       )}

//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle>{editMode ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
//         <Box component="form" onSubmit={editMode ? updateData : postData} sx={{ p: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField fullWidth label="Topic Name" name="topicName" value={userdata.topicName} onChange={changeHandler} error={!!errors.topicName} helperText={errors.topicName} />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField fullWidth label="Description" name="description" value={userdata.description} onChange={changeHandler} error={!!errors.description} helperText={errors.description} multiline rows={3} />
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth error={!!errors.moduleId}>
//                 <InputLabel>Module</InputLabel>
//                 <Select name="moduleId" value={userdata.moduleId} onChange={changeHandler}>
//                   {modules.map(mod => <MenuItem key={mod.moduleId} value={mod.moduleId}>{mod.moduleName}</MenuItem>)}
//                 </Select>
//                 <FormHelperText>{errors.moduleId}</FormHelperText>
//               </FormControl>
//             </Grid>

//             {/* PDF Upload */}
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="PDF File"
//                 value={userdata.pdfFileName}
//                 disabled
//                 InputProps={{
//                   endAdornment: <Button variant="contained" onClick={uploadFile}>Upload</Button>
//                 }}
//               />
//               <input type="file" ref={inputRef} style={{ marginTop: 10 }} accept="application/pdf" onChange={e => onFileChange(e, 'pdf')} />
//             </Grid>

//             {/* Video Upload */}
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Context Video"
//                 value={userdata.videoFileName}
//                 disabled
//                 InputProps={{
//                   endAdornment: <Button variant="contained" onClick={uploadFile}>Upload</Button>
//                 }}
//               />
//               <input type="file" ref={inputRef} style={{ marginTop: 10 }} accept="video/mp4,video/x-m4v" onChange={e => onFileChange(e, 'video')} />
//             </Grid>

//           </Grid>
//           <DialogActions>
//             <Button onClick={() => setOpen(false)}>Cancel</Button>
//             <Button type="submit" variant="contained">{editMode ? 'Update' : 'Save'}</Button>
//           </DialogActions>
//         </Box>
//       </Dialog>
//     </MainCard>
//   );
// };

// export default AcademyTopics;


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
//   Select,
//   ToggleButtonGroup,
//   ToggleButton,
//   Card,
//   CardContent,
//   CardMedia,
//   Typography
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
// import MainCard from 'ui-component/cards/MainCard';
// import { useState, useEffect, useRef } from 'react';
// import moment from 'moment';
// import { useTheme } from '@mui/material/styles';
// import { addTopic, deleteTopic, fetchAllModules, fetchTopics, fetchTopicById, updatedTopic } from 'views/API/TopicApi';
// import { BaseUrl } from 'BaseUrl';
// import axios from 'axios';
// import Swal from 'sweetalert2';

// import TopicCards from './TopicCards';

// const columns = [
//   { id: 'displayId', label: 'ID' },
//   { id: 'topicName', label: 'Name', minWidth: 150 },
//   { id: 'description', label: 'Description', minWidth: 450 },
//   { id: 'moduleName', label: 'Module', minWidth: 150 },
//   { id: 'videoUrl', label: 'Context Video' },
//   { id: 'file', label: 'PDF File', minWidth: 200 },
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
//   const [viewMode, setViewMode] = useState('list');
//   const [userdata, setUserData] = useState({
//     topicName: '',
//     description: '',
//     moduleId: '',
//     videoUrl: '',
//     pdfFileName: '',
//     videoFileName: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [refreshTrigger, setRefreshTrigger] = useState(false);
//   const [topicId, setTopicId] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [fileType, setFileType] = useState('');
//   const inputRef = useRef(null);

//   const user = JSON.parse(sessionStorage.getItem('user'));
//   const headers = {
//     'Content-type': 'application/json',
//     Authorization: 'Bearer ' + user.accessToken
//   };
//   const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

//   // Fetch topics
//   const fetchData = async () => {
//     try {
//       const res = await fetchTopics(headers);
//       const fetchedData = res.data.content;
//       if (fetchedData) {
//         // Sort by topicId in ascending order
//         const sortedData = fetchedData.sort((a, b) => a.topicId - b.topicId);
        
//         // Add sequential index for display
//         const tableData = sortedData.map((p, index) => ({
//           displayId: index + 1, // Sequential number for display
//           topicId: p.topicId,
//           topicName: p.topicName,
//           description: p.description,
//           moduleName: p.moduleDtoList ? p.moduleDtoList.moduleName : 'No Module',
//           videoUrl: p.videoUrl,
//           filePath: p.filePath,
//           fileName: p.fileName,
//           insertedDate: moment(p.insertedDate).format('L'),
//           updatedDate: moment(p.updatedDate).format('L'),
//           createdBy: p.createdBy?.userName || 'No User',
//           updatedBy: p.updatedBy?.userName || 'No User'
//         }));
//         setTopics(tableData);
//       } else setTopics([]);
//     } catch (error) {
//       console.error('Error fetching topics:', error);
//     }
//   };

//   const fetchModules = async () => {
//     try {
//       const res = await fetchAllModules(headers);
//       setModules(res.data.sort((a, b) => a.moduleName.localeCompare(b.moduleName)));
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
//     if (!userdata.topicName?.trim()) newErrors.topicName = 'Enter the topic name';
//     if (!userdata.description?.trim()) newErrors.description = 'Enter the description';
//     if (!userdata.videoUrl?.trim()) newErrors.videoUrl = 'Enter the video URL';
//     if (!userdata.moduleId) newErrors.moduleId = 'Select a module';
//     return newErrors;
//   };

//   const changeHandler = (e) => {
//     setUserData({ ...userdata, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: null });
//   };

//   const handleAddTopic = () => {
//     setEditMode(false);
//     setUserData({ topicName: '', description: '', moduleId: '', videoUrl: '', pdfFileName: '', videoFileName: '' });
//     setOpen(true);
//   };

//   const onFileChange = (e, type) => {
//     setSelectedFile(e.target.files[0]);
//     setFileType(type);
//   };

//   const uploadFile = async () => {
//     if (!selectedFile) {
//       Swal.fire({ icon: 'error', title: 'No file selected', text: 'Please select a file', confirmButtonColor: theme.palette.primary.main });
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     try {
//       Swal.fire({ title: 'Uploading...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
//       const res = await axios.post(`${BaseUrl}/file/uploadFile`, formData, {
//         headers: { 'Content-type': 'multipart/form-data', Authorization: 'Bearer ' + user.accessToken }
//       });
//       Swal.close();

//       if (res.status === 200) {
//         if (fileType === 'pdf') {
//           setUserData(prev => ({ ...prev, pdfFileName: res.data.fileName }));
//         } else if (fileType === 'video') {
//           setUserData(prev => ({ ...prev, videoFileName: res.data.fileName }));
//         }
//         Swal.fire({ icon: 'success', title: 'File uploaded successfully', showConfirmButton: false, timer: 1500 });
//       }
//     } catch (err) {
//       Swal.close();
//       Swal.fire({ icon: 'error', title: 'Upload failed', text: 'Please try again', confirmButtonColor: theme.palette.primary.main });
//       console.error(err);
//     }
//   };

//   const postData = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     const payload = {
//       ...userdata,
//       moduleDtoList: { moduleId: userdata.moduleId },
//       createdBy: { userId: user.userId }
//     };
//     try {
//       const res = await addTopic(payload, headers);
//       if (res.data.responseCode === 201) {
//         setRefreshTrigger(!refreshTrigger);
//         setOpen(false);
//         Swal.fire({ icon: 'success', title: 'Topic added successfully', showConfirmButton: false, timer: 1500 });
//       } else {
//         Swal.fire({ icon: 'error', title: 'Error', text: res.data.errorMessage, confirmButtonColor: theme.palette.primary.main });
//       }
//     } catch (err) {
//       console.error(err);
//       Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to add topic', confirmButtonColor: theme.palette.primary.main });
//     }
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
//         videoUrl: det.videoUrl,
//         pdfFileName: det.fileName,
//         videoFileName: det.videoFileName || '',
//         moduleId: det.moduleDtoList?.moduleId || ''
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateData = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     const payload = {
//       topicId,
//       ...userdata,
//       moduleDtoList: { moduleId: userdata.moduleId },
//       updatedBy: { userId: user.userId }
//     };
//     try {
//       const res = await updatedTopic(payload, headers);
//       if (res.data.responseCode === 200) {
//         setRefreshTrigger(!refreshTrigger);
//         setOpen(false);
//         Swal.fire({ icon: 'success', title: 'Topic updated successfully', showConfirmButton: false, timer: 1500 });
//       } else {
//         Swal.fire({ icon: 'error', title: 'Error', text: res.data.errorMessage, confirmButtonColor: theme.palette.primary.main });
//       }
//     } catch (err) {
//       console.error(err);
//       Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update topic', confirmButtonColor: theme.palette.primary.main });
//     }
//   };

//   const deleteData = async (topicId) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, delete it!'
//     });

//     if (!result.isConfirmed) return;
    
//     try {
//       const res = await deleteTopic(topicId, headers);
//       if (res.data.responseCode === 200) {
//         setRefreshTrigger(!refreshTrigger);
//         Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Topic has been deleted.', showConfirmButton: false, timer: 1500 });
//       } else {
//         Swal.fire({ icon: 'error', title: 'Error', text: res.data.errorMessage, confirmButtonColor: theme.palette.primary.main });
//       }
//     } catch (err) {
//       console.error(err);
//       Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete topic', confirmButtonColor: theme.palette.primary.main });
//     }
//   };

//   return (
//     <MainCard
//       title={
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <span>Topic</span>
//           <Box display="flex" alignItems="center" gap={1}>
//             <ToggleButtonGroup
//               value={viewMode}
//               exclusive
//               onChange={(e, val) => val && setViewMode(val)}
//               size="small"
//             >
//               <ToggleButton value="list">
//                 <ViewList />
//               </ToggleButton>
//               <ToggleButton value="card">
//                 <ViewModule />
//               </ToggleButton>
//             </ToggleButtonGroup>
//             <Button 
//               variant="contained" 
//               onClick={handleAddTopic} 
//               sx={{ backgroundColor: '#03045E', '&:hover': { opacity: 0.9 } }}
//             >
//               Add <AddIcon sx={{ color: '#fff' }} />
//             </Button>
//           </Box>
//         </Box>
//       }
//     >
//       {viewMode === 'list' ? (
//         <Paper>
//           <TableContainer sx={{ maxHeight: 440 }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   {columns.map((col) => (
//                     <TableCell key={col.id} align={col.align} style={{ minWidth: col.minWidth }}>
//                       {col.label}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {topics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((topic) => (
//                   <TableRow hover key={topic.topicId}>
//                     {columns.map((col) => (
//                       <TableCell key={col.id} align={col.align}>
//                         {col.id === 'actions' ? (
//                           <>
//                             <IconButton onClick={() => handleEdit(topic.topicId)} color="primary">
//                               <Edit />
//                             </IconButton>
//                             <IconButton onClick={() => deleteData(topic.topicId)} color="error">
//                               <DeleteForever />
//                             </IconButton>
//                           </>
//                         ) : col.id === 'file' ? (
//                           topic.filePath ? (
//                             <img src={ImageUrl + topic.filePath} alt={topic.fileName} style={{ width: 100, height: 50 }} />
//                           ) : (
//                             'NO FILE FOUND'
//                           )
//                         ) : col.id === 'description' ? (
//                           <div style={{ textAlign: 'justify', whiteSpace: 'pre-line' }}>
//                             {topic[col.id]}
//                           </div>
//                         ) : (
//                           topic[col.id]
//                         )}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={topics.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={(e, newPage) => setPage(newPage)}
//             onRowsPerPageChange={(e) => {
//               setRowsPerPage(+e.target.value);
//               setPage(0);
//             }}
//           />
//         </Paper>
//       ) : (
//         <TopicCards
//           topics={topics}
//           page={page}
//           rowsPerPage={rowsPerPage}
//           onEdit={handleEdit}
//           onDelete={deleteData}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(+e.target.value);
//             setPage(0);
//           }}
//           ImageUrl={ImageUrl}
//         />
//       )}

//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle>{editMode ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
//         <Box component="form" onSubmit={editMode ? updateData : postData} sx={{ p: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField fullWidth label="Topic Name" name="topicName" value={userdata.topicName} onChange={changeHandler} error={!!errors.topicName} helperText={errors.topicName} />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField fullWidth label="Description" name="description" value={userdata.description} onChange={changeHandler} error={!!errors.description} helperText={errors.description} multiline rows={3} />
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth error={!!errors.moduleId}>
//                 <InputLabel>Module</InputLabel>
//                 <Select name="moduleId" value={userdata.moduleId} onChange={changeHandler}>
//                   {modules.map(mod => <MenuItem key={mod.moduleId} value={mod.moduleId}>{mod.moduleName}</MenuItem>)}
//                 </Select>
//                 <FormHelperText>{errors.moduleId}</FormHelperText>
//               </FormControl>
//             </Grid>

//             {/* PDF Upload */}
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="PDF File"
//                 value={userdata.pdfFileName}
//                 disabled
//                 InputProps={{
//                   endAdornment: <Button variant="contained" onClick={uploadFile}>Upload</Button>
//                 }}
//               />
//               <input type="file" ref={inputRef} style={{ marginTop: 10 }} accept="application/pdf" onChange={e => onFileChange(e, 'pdf')} />
//             </Grid>

//             {/* Video Upload */}
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Context Video"
//                 value={userdata.videoFileName}
//                 disabled
//                 InputProps={{
//                   endAdornment: <Button variant="contained" onClick={uploadFile}>Upload</Button>
//                 }}
//               />
//               <input type="file" ref={inputRef} style={{ marginTop: 10 }} accept="video/mp4,video/x-m4v" onChange={e => onFileChange(e, 'video')} />
//             </Grid>

//           </Grid>
//           <DialogActions>
//             <Button onClick={() => setOpen(false)}>Cancel</Button>
//             <Button type="submit" variant="contained">{editMode ? 'Update' : 'Save'}</Button>
//           </DialogActions>
//         </Box>
//       </Dialog>
//     </MainCard>
//   );
// };

// export default AcademyTopics;

// src/views/Topic/AcademyTopics.jsx
import * as React from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, IconButton, FormControl, InputLabel, MenuItem,
  FormHelperText, Select, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import {
  addTopic,
  deleteTopic,
  fetchAllModules,
  fetchTopics,
  fetchTopicById,
  updatedTopic
} from 'views/API/TopicApi';
import { BaseUrl } from 'BaseUrl';
import axios from 'axios';
import Swal from 'sweetalert2';
import TopicCards from './TopicCards';

const columns = [
  { id: 'displayId', label: 'ID' },
  //   { id: 'topicId', label: 'Topic ID' }, // Backend ID
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

// this code contain both serial number and backend ID
// const columns = [
//   { id: 'serialId', label: 'S.No' }, // Serial number
//   { id: 'topicId', label: 'Topic ID' }, // Backend ID
//   { id: 'topicName', label: 'Name', minWidth: 150 },
//   { id: 'description', label: 'Description', minWidth: 450 },
//   { id: 'moduleName', label: 'Module', minWidth: 150 },
//   { id: 'videoUrl', label: 'Context Video' },
//   { id: 'file', label: 'PDF File', minWidth: 200 },
//   { id: 'createdBy', label: 'Created By', align: 'right' },
//   { id: 'updatedBy', label: 'Updated By', align: 'right' },
//   { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
//   { id: 'updatedDate', label: 'Updated Date', align: 'right' },
//   { id: 'actions', label: 'Actions', align: 'right' }
// ];


const AcademyTopics = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [topics, setTopics] = useState([]);
  const [modules, setModules] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState('list');
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

  // fetch topics
  const fetchData = async () => {
    try {
      const res = await fetchTopics(headers);
      const fetchedData = res.data.content;
      if (fetchedData) {
        const sortedData = fetchedData.sort((a, b) => a.topicId - b.topicId);
        const tableData = sortedData.map((p, index) => ({
          displayId: index + 1,
          topicId: p.topicId,
          topicName: p.topicName,
          description: p.description,
          moduleName: p.moduleDtoList ? p.moduleDtoList.moduleName : 'No Module',
          moduleId: p.moduleDtoList?.moduleId || '',
          videoUrl: p.videoUrl,
          filePath: p.filePath,
          fileName: p.fileName,
          videoFileName: p.videoFileName || '',
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy?.userName || 'No User',
          updatedBy: p.updatedBy?.userName || 'No User'
        }));
        setTopics(tableData);
      } else setTopics([]);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };


  // this code contain both serial number and backend ID
//   const fetchData = async () => {
//   try {
//     const res = await fetchTopics(headers);
//     const fetchedData = res.data.content;
//     if (fetchedData) {
//       const sortedData = fetchedData.sort((a, b) => a.topicId - b.topicId);
//       const tableData = sortedData.map((p, index) => ({
//         serialId: index + 1, // Serial number
//         topicId: p.topicId, // Backend ID
//         topicName: p.topicName,
//         description: p.description,
//         moduleName: p.moduleDtoList ? p.moduleDtoList.moduleName : 'No Module',
//         moduleId: p.moduleDtoList?.moduleId || '',
//         videoUrl: p.videoUrl,
//         filePath: p.filePath,
//         fileName: p.fileName,
//         videoFileName: p.videoFileName || '',
//         insertedDate: moment(p.insertedDate).format('L'),
//         updatedDate: moment(p.updatedDate).format('L'),
//         createdBy: p.createdBy?.userName || 'No User',
//         updatedBy: p.updatedBy?.userName || 'No User'
//       }));
//       setTopics(tableData);
//     } else setTopics([]);
//   } catch (error) {
//     console.error('Error fetching topics:', error);
//   }
// };

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
    setUserData({ 
      topicName: '', 
      description: '', 
      moduleId: '', 
      videoUrl: '', 
      pdfFileName: '', 
      videoFileName: '' 
    });
    setSelectedFile(null);
    setFileType('');
    setOpen(true);
  };

  const handleEdit = async (topic) => {
    setEditMode(true);
    setOpen(true);
    setTopicId(topic.topicId);

    // prefill immediately
    setUserData({
      topicName: topic.topicName,
      description: topic.description,
      videoUrl: topic.videoUrl,
      pdfFileName: topic.fileName,
      videoFileName: topic.videoFileName || '',
      moduleId: topic.moduleId || ''
    });

    try {
      const res = await fetchTopicById(topic.topicId, headers);
      const det = res.data;
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

  const deleteData = async (topicId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;

    try {
      const res = await deleteTopic(topicId, headers);
      if (res.data.responseCode === 200) {
        setRefreshTrigger(!refreshTrigger);
        Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Topic has been deleted.', showConfirmButton: false, timer: 1500 });
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res.data.errorMessage });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete topic' });
    }
  };

  // file upload
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setFileType(type);
    if (type === 'pdf') {
      setUserData({ ...userdata, pdfFileName: file.name });
    } else if (type === 'video') {
      setUserData({ ...userdata, videoFileName: file.name });
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return null;
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const res = await axios.post(`${BaseUrl}/file/uploadFile`, formData, {
        headers: { Authorization: 'Bearer ' + user.accessToken }
      });
      return res.data.filePath;
    } catch (err) {
      console.error('File upload failed:', err);
      return null;
    }
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    let uploadedFilePath = null;
    if (selectedFile) {
      uploadedFilePath = await uploadFile();
    }

    const payload = {
      topicName: userdata.topicName,
      description: userdata.description,
      moduleId: userdata.moduleId,
      videoUrl: userdata.videoUrl,
      filePath: uploadedFilePath || userdata.pdfFileName,
      fileName: userdata.pdfFileName,
      videoFileName: userdata.videoFileName
    };

    try {
      let res;
      if (editMode) {
        res = await updatedTopic(topicId, payload, headers);
      } else {
        res = await addTopic(payload, headers);
      }

      if (res.data.responseCode === 200) {
        setRefreshTrigger(!refreshTrigger);
        Swal.fire({
          icon: 'success',
          title: editMode ? 'Updated!' : 'Added!',
          text: `Topic has been ${editMode ? 'updated' : 'added'} successfully.`,
          showConfirmButton: false,
          timer: 1500
        });
        setOpen(false);
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res.data.errorMessage });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong' });
    }
  };

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Topic</span>
          <Box display="flex" alignItems="center" gap={1}>
            <ToggleButtonGroup value={viewMode} exclusive onChange={(e, val) => val && setViewMode(val)} size="small">
              <ToggleButton value="list"><ViewList /></ToggleButton>
              <ToggleButton value="card"><ViewModule /></ToggleButton>
            </ToggleButtonGroup>
            <Button variant="contained" onClick={handleAddTopic} sx={{ backgroundColor: '#03045E', '&:hover': { opacity: 0.9 } }}>
              Add <AddIcon sx={{ color: '#fff' }} />
            </Button>
          </Box>
        </Box>
      }
    >
      {viewMode === 'list' ? (
        <Paper>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col.id} align={col.align} style={{ minWidth: col.minWidth }}>{col.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {topics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((topic) => (
                  <TableRow hover key={topic.topicId}>
                    {columns.map((col) => (
                      <TableCell key={col.id} align={col.align}>
                        {col.id === 'actions' ? (
                          <>
                            <IconButton onClick={() => handleEdit(topic)} color="primary"><Edit /></IconButton>
                            <IconButton onClick={() => deleteData(topic.topicId)} color="error"><DeleteForever /></IconButton>
                          </>
                        ) : col.id === 'file' ? (
                          topic.filePath ? (
                            <img src={ImageUrl + topic.filePath} alt={topic.fileName} style={{ width: 100, height: 50 }} />
                          ) : 'NO FILE FOUND'
                        ) : col.id === 'description' ? (
                          <div style={{ textAlign: 'justify', whiteSpace: 'pre-line' }}>{topic[col.id]}</div>
                        ) : (
                          topic[col.id]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={topics.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
          />
        </Paper>
      ) : (
        <TopicCards
          topics={topics}
          page={page}
          rowsPerPage={rowsPerPage}
          onEdit={handleEdit}
          onDelete={deleteData}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
          ImageUrl={ImageUrl}
        />
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Topic Name"
            name="topicName"
            value={userdata.topicName}
            onChange={changeHandler}
            error={!!errors.topicName}
            helperText={errors.topicName}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={userdata.description}
            onChange={changeHandler}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            multiline
            rows={3}
          />
          <FormControl fullWidth margin="dense" error={!!errors.moduleId}>
            <InputLabel>Module</InputLabel>
            <Select
              name="moduleId"
              value={userdata.moduleId}
              onChange={changeHandler}
            >
              {modules.map((m) => (
                <MenuItem key={m.moduleId} value={m.moduleId}>{m.moduleName}</MenuItem>
              ))}
            </Select>
            {errors.moduleId && <FormHelperText>{errors.moduleId}</FormHelperText>}
          </FormControl>
          <TextField
            margin="dense"
            label="Video URL"
            name="videoUrl"
            value={userdata.videoUrl}
            onChange={changeHandler}
            error={!!errors.videoUrl}
            helperText={errors.videoUrl}
            fullWidth
          />

          {/* File inputs */}
          <Box mt={2}>
            <Button variant="outlined" component="label">
              Upload PDF
              <input type="file" hidden accept="application/pdf" onChange={(e) => handleFileChange(e, 'pdf')} />
            </Button>
            {userdata.pdfFileName && <span style={{ marginLeft: 10 }}>{userdata.pdfFileName}</span>}
          </Box>
          <Box mt={2}>
            <Button variant="outlined" component="label">
              Upload Video
              <input type="file" hidden accept="video/*" onChange={(e) => handleFileChange(e, 'video')} />
            </Button>
            {userdata.videoFileName && <span style={{ marginLeft: 10 }}>{userdata.videoFileName}</span>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editMode ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default AcademyTopics;

// import * as React from 'react';
// import {
//   Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
//   TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
//   TablePagination, TableRow, IconButton, FormControl, InputLabel, MenuItem,
//   FormHelperText, Select, ToggleButtonGroup, ToggleButton, Chip, CircularProgress
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit, ViewList, ViewModule, PictureAsPdf, VideoFile } from '@mui/icons-material';
// import MainCard from 'ui-component/cards/MainCard';
// import { useState, useEffect, useCallback } from 'react';
// import moment from 'moment';
// import { useTheme } from '@mui/material/styles';
// import {
//   addTopic,
//   deleteTopic,
//   fetchAllModules,
//   fetchTopics,
//   fetchTopicById,
//   updatedTopic
// } from 'views/API/TopicApi';
// import { BaseUrl } from 'BaseUrl';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import TopicCards from './TopicCards';

// const columns = [
//   { id: 'displayId', label: 'ID' },
//   { id: 'topicName', label: 'Name', minWidth: 150 },
//   { id: 'description', label: 'Description', minWidth: 450 },
//   { id: 'moduleName', label: 'Module', minWidth: 150 },
//   { id: 'videoUrl', label: 'Context Video' },
//   { id: 'file', label: 'PDF File', minWidth: 200 },
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
//   const [viewMode, setViewMode] = useState('list');
//   const [userdata, setUserData] = useState({
//     topicName: '',
//     description: '',
//     moduleId: '',
//     videoUrl: '',
//     pdfFileName: '',
//     videoFileName: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [refreshTrigger, setRefreshTrigger] = useState(0); // Changed to number to avoid toggle issues
//   const [topicId, setTopicId] = useState(null);
//   const [selectedPdfFile, setSelectedPdfFile] = useState(null);
//   const [selectedVideoFile, setSelectedVideoFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const user = JSON.parse(sessionStorage.getItem('user'));
  
//   // Memoize headers to prevent recreation on every render
//   const headers = React.useMemo(() => ({
//     'Content-type': 'application/json',
//     Authorization: 'Bearer ' + user.accessToken
//   }), [user.accessToken]);

//   const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

//   // fetch topics with useCallback to prevent unnecessary re-renders
//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await fetchTopics(headers);
//       const fetchedData = res.data.content;
//       if (fetchedData) {
//         const sortedData = fetchedData.sort((a, b) => a.topicId - b.topicId);
//         const tableData = sortedData.map((p, index) => ({
//           displayId: index + 1,
//           topicId: p.topicId,
//           topicName: p.topicName,
//           description: p.description,
//           moduleName: p.moduleDtoList ? p.moduleDtoList.moduleName : 'No Module',
//           moduleId: p.moduleDtoList?.moduleId || '',
//           videoUrl: p.videoUrl,
//           filePath: p.filePath,
//           fileName: p.fileName,
//           videoFileName: p.videoFileName || '',
//           insertedDate: moment(p.insertedDate).format('L'),
//           updatedDate: moment(p.updatedDate).format('L'),
//           createdBy: p.createdBy?.userName || 'No User',
//           updatedBy: p.updatedBy?.userName || 'No User'
//         }));
//         setTopics(tableData);
//       } else {
//         setTopics([]);
//       }
//     } catch (error) {
//       console.error('Error fetching topics:', error);
//       Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to fetch topics' });
//     } finally {
//       setLoading(false);
//     }
//   }, [headers]);

//   const fetchModules = useCallback(async () => {
//     try {
//       const res = await fetchAllModules(headers);
//       setModules(res.data.sort((a, b) => a.moduleName.localeCompare(b.moduleName)));
//     } catch (error) {
//       console.error('Error fetching modules:', error);
//       Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to fetch modules' });
//     }
//   }, [headers]);

//   useEffect(() => {
//     fetchData();
//     fetchModules();
//   }, [fetchData, fetchModules, refreshTrigger]); // Add dependencies

//   const validateForm = useCallback(() => {
//     const newErrors = {};
//     if (!userdata.topicName?.trim()) newErrors.topicName = 'Enter the topic name';
//     if (!userdata.description?.trim()) newErrors.description = 'Enter the description';
//     if (!userdata.videoUrl?.trim() && !selectedVideoFile) newErrors.videoUrl = 'Enter the video URL or upload a video file';
//     if (!userdata.moduleId) newErrors.moduleId = 'Select a module';
    
//     // Validate URL format if provided
//     if (userdata.videoUrl?.trim() && !isValidUrl(userdata.videoUrl)) {
//       newErrors.videoUrl = 'Please enter a valid URL';
//     }
    
//     return newErrors;
//   }, [userdata, selectedVideoFile]);

//   const isValidUrl = useCallback((string) => {
//     try {
//       new URL(string);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   }, []);

//   const changeHandler = useCallback((e) => {
//     setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//     setErrors(prev => ({ ...prev, [e.target.name]: null }));
//   }, []);

//   const handleAddTopic = useCallback(() => {
//     setEditMode(false);
//     setUserData({ 
//       topicName: '', 
//       description: '', 
//       moduleId: '', 
//       videoUrl: '', 
//       pdfFileName: '', 
//       videoFileName: '' 
//     });
//     setSelectedPdfFile(null);
//     setSelectedVideoFile(null);
//     setErrors({});
//     setOpen(true);
//   }, []);

//   const handleEdit = useCallback(async (topic) => {
//     setEditMode(true);
//     setOpen(true);
//     setTopicId(topic.topicId);

//     // prefill immediately
//     setUserData({
//       topicName: topic.topicName,
//       description: topic.description,
//       videoUrl: topic.videoUrl,
//       pdfFileName: topic.fileName,
//       videoFileName: topic.videoFileName || '',
//       moduleId: topic.moduleId || ''
//     });

//     try {
//       const res = await fetchTopicById(topic.topicId, headers);
//       const det = res.data;
//       setUserData({
//         topicName: det.topicName,
//         description: det.description,
//         videoUrl: det.videoUrl,
//         pdfFileName: det.fileName,
//         videoFileName: det.videoFileName || '',
//         moduleId: det.moduleDtoList?.moduleId || ''
//       });
//     } catch (err) {
//       console.error(err);
//       Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to fetch topic details' });
//     }
//   }, [headers]);

//   const deleteData = useCallback(async (topicId) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, delete it!'
//     });
//     if (!result.isConfirmed) return;

//     try {
//       const res = await deleteTopic(topicId, headers);
//       if (res.data.responseCode === 200) {
//         setRefreshTrigger(prev => prev + 1); // Use functional update
//         Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Topic has been deleted.', showConfirmButton: false, timer: 1500 });
//       } else {
//         Swal.fire({ icon: 'error', title: 'Error', text: res.data.errorMessage });
//       }
//     } catch (err) {
//       console.error(err);
//       Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete topic' });
//     }
//   }, [headers]);

//   // file upload
//   const handleFileChange = useCallback((e, type) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     if (type === 'pdf') {
//       setSelectedPdfFile(file);
//       setUserData(prev => ({ ...prev, pdfFileName: file.name }));
//     } else if (type === 'video') {
//       setSelectedVideoFile(file);
//       setUserData(prev => ({ ...prev, videoFileName: file.name, videoUrl: '' }));
//       setErrors(prev => ({ ...prev, videoUrl: null }));
//     }
//   }, []);

//   const uploadFile = useCallback(async (file) => {
//     if (!file) return null;
//     const formData = new FormData();
//     formData.append('file', file);
//     try {
//       const res = await axios.post(`${BaseUrl}/file/uploadFile`, formData, {
//         headers: { Authorization: 'Bearer ' + user.accessToken }
//       });
//       return res.data.filePath;
//     } catch (err) {
//       console.error('File upload failed:', err);
//       Swal.fire({ icon: 'error', title: 'Error', text: 'File upload failed' });
//       return null;
//     }
//   }, [user.accessToken]);

//   const handleSubmit = useCallback(async () => {
//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     let uploadedPdfPath = null;
//     let uploadedVideoPath = null;
    
//     if (selectedPdfFile) {
//       uploadedPdfPath = await uploadFile(selectedPdfFile);
//     }
    
//     if (selectedVideoFile) {
//       uploadedVideoPath = await uploadFile(selectedVideoFile);
//     }

//     const payload = {
//       topicName: userdata.topicName,
//       description: userdata.description,
//       moduleId: userdata.moduleId,
//       videoUrl: userdata.videoUrl,
//       filePath: uploadedPdfPath || userdata.filePath,
//       fileName: userdata.pdfFileName,
//       videoFileName: userdata.videoFileName,
//       videoFilePath: uploadedVideoPath
//     };

//     try {
//       setLoading(true);
//       let res;
//       if (editMode) {
//         res = await updatedTopic(topicId, payload, headers);
//       } else {
//         res = await addTopic(payload, headers);
//       }

//       if (res.data.responseCode === 200) {
//         setRefreshTrigger(prev => prev + 1); // Use functional update
//         Swal.fire({
//           icon: 'success',
//           title: editMode ? 'Updated!' : 'Added!',
//           text: `Topic has been ${editMode ? 'updated' : 'added'} successfully.`,
//           showConfirmButton: false,
//           timer: 1500
//         });
//         setOpen(false);
//         // Reset form
//         setUserData({
//           topicName: '',
//           description: '',
//           moduleId: '',
//           videoUrl: '',
//           pdfFileName: '',
//           videoFileName: ''
//         });
//         setSelectedPdfFile(null);
//         setSelectedVideoFile(null);
//       } else {
//         Swal.fire({ icon: 'error', title: 'Error', text: res.data.errorMessage });
//       }
//     } catch (err) {
//       console.error(err);
//       Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong' });
//     } finally {
//       setLoading(false);
//     }
//   }, [validateForm, selectedPdfFile, selectedVideoFile, userdata, editMode, topicId, headers, uploadFile]);

//   const handleDownloadPdf = useCallback((filePath, fileName) => {
//     if (!filePath) return;
    
//     const link = document.createElement('a');
//     link.href = `${ImageUrl}${filePath}`;
//     link.setAttribute('download', fileName || 'document.pdf');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }, [ImageUrl]);

//   const handleViewModeChange = useCallback((event, newViewMode) => {
//     if (newViewMode !== null) {
//       setViewMode(newViewMode);
//     }
//   }, []);

//   const handleChangePage = useCallback((event, newPage) => {
//     setPage(newPage);
//   }, []);

//   const handleChangeRowsPerPage = useCallback((event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   }, []);

//   const handleCloseDialog = useCallback(() => {
//     setOpen(false);
//     setErrors({});
//   }, []);

//   return (
//     <MainCard
//       title={
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <span>Topic</span>
//           <Box display="flex" alignItems="center" gap={1}>
//             <ToggleButtonGroup 
//               value={viewMode} 
//               exclusive 
//               onChange={handleViewModeChange} 
//               size="small"
//             >
//               <ToggleButton value="list"><ViewList /></ToggleButton>
//               <ToggleButton value="card"><ViewModule /></ToggleButton>
//             </ToggleButtonGroup>
//             <Button variant="contained" onClick={handleAddTopic} sx={{ backgroundColor: '#03045E', '&:hover': { opacity: 0.9 } }}>
//               Add <AddIcon sx={{ color: '#fff' }} />
//             </Button>
//           </Box>
//         </Box>
//       }
//     >
//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" height={200}>
//           <CircularProgress />
//         </Box>
//       ) : viewMode === 'list' ? (
//         <Paper>
//           <TableContainer sx={{ maxHeight: 440 }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   {columns.map((col) => (
//                     <TableCell key={col.id} align={col.align} style={{ minWidth: col.minWidth }}>{col.label}</TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {topics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((topic) => (
//                   <TableRow hover key={topic.topicId}>
//                     {columns.map((col) => (
//                       <TableCell key={col.id} align={col.align}>
//                         {col.id === 'actions' ? (
//                           <>
//                             <IconButton onClick={() => handleEdit(topic)} color="primary"><Edit /></IconButton>
//                             <IconButton onClick={() => deleteData(topic.topicId)} color="error"><DeleteForever /></IconButton>
//                           </>
//                         ) : col.id === 'file' ? (
//                           topic.filePath ? (
//                             <Chip
//                               icon={<PictureAsPdf />}
//                               label={topic.fileName || "PDF File"}
//                               onClick={() => handleDownloadPdf(topic.filePath, topic.fileName)}
//                               variant="outlined"
//                               clickable
//                             />
//                           ) : 'NO FILE FOUND'
//                         ) : col.id === 'videoUrl' ? (
//                           topic.videoUrl ? (
//                             <Button
//                               variant="outlined"
//                               size="small"
//                               startIcon={<VideoFile />}
//                               href={topic.videoUrl}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               Watch Video
//                             </Button>
//                           ) : topic.videoFileName ? (
//                             <Chip
//                               icon={<VideoFile />}
//                               label="Uploaded Video"
//                               variant="outlined"
//                             />
//                           ) : (
//                             'NO VIDEO'
//                           )
//                         ) : col.id === 'description' ? (
//                           <div style={{ textAlign: 'justify', whiteSpace: 'pre-line' }}>{topic[col.id]}</div>
//                         ) : (
//                           topic[col.id]
//                         )}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={topics.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </Paper>
//       ) : (
//         <TopicCards
//           topics={topics}
//           page={page}
//           rowsPerPage={rowsPerPage}
//           onEdit={handleEdit}
//           onDelete={deleteData}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           ImageUrl={ImageUrl}
//           onDownloadPdf={handleDownloadPdf}
//         />
//       )}

//       {/* Add/Edit Dialog */}
//       <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
//         <DialogTitle>{editMode ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
//         <DialogContent>
//           <TextField
//             margin="dense"
//             label="Topic Name"
//             name="topicName"
//             value={userdata.topicName}
//             onChange={changeHandler}
//             error={!!errors.topicName}
//             helperText={errors.topicName}
//             fullWidth
//             required
//           />
//           <TextField
//             margin="dense"
//             label="Description"
//             name="description"
//             value={userdata.description}
//             onChange={changeHandler}
//             error={!!errors.description}
//             helperText={errors.description}
//             fullWidth
//             multiline
//             rows={3}
//             required
//           />
//           <FormControl fullWidth margin="dense" error={!!errors.moduleId} required>
//             <InputLabel>Module</InputLabel>
//             <Select
//               name="moduleId"
//               value={userdata.moduleId}
//               onChange={changeHandler}
//               label="Module"
//             >
//               {modules.map((m) => (
//                 <MenuItem key={m.moduleId} value={m.moduleId}>{m.moduleName}</MenuItem>
//               ))}
//             </Select>
//             {errors.moduleId && <FormHelperText>{errors.moduleId}</FormHelperText>}
//           </FormControl>
          
//           <Box mt={2}>
//             <TextField
//               margin="dense"
//               label="Video URL"
//               name="videoUrl"
//               value={userdata.videoUrl}
//               onChange={changeHandler}
//               error={!!errors.videoUrl}
//               helperText={errors.videoUrl || "Enter a video URL or upload a video file below"}
//               fullWidth
//               disabled={!!selectedVideoFile}
//             />
//             <Box mt={1}>
//               <Button variant="outlined" component="label" disabled={!!userdata.videoUrl}>
//                 Upload Video File
//                 <input 
//                   type="file" 
//                   hidden 
//                   accept="video/*" 
//                   onChange={(e) => handleFileChange(e, 'video')} 
//                   disabled={!!userdata.videoUrl}
//                 />
//               </Button>
//               {userdata.videoFileName && (
//                 <Chip 
//                   label={userdata.videoFileName} 
//                   onDelete={() => {
//                     setSelectedVideoFile(null);
//                     setUserData(prev => ({...prev, videoFileName: ''}));
//                   }} 
//                   variant="outlined" 
//                   sx={{ ml: 1 }}
//                 />
//               )}
//             </Box>
//           </Box>

//           {/* PDF upload */}
//           <Box mt={2}>
//             <Button variant="outlined" component="label">
//               Upload PDF
//               <input type="file" hidden accept="application/pdf" onChange={(e) => handleFileChange(e, 'pdf')} />
//             </Button>
//             {userdata.pdfFileName && (
//               <Chip 
//                 label={userdata.pdfFileName} 
//                 onDelete={() => {
//                   setSelectedPdfFile(null);
//                   setUserData(prev => ({...prev, pdfFileName: ''}));
//                 }} 
//                 variant="outlined" 
//                 sx={{ ml: 1 }}
//               />
//             )}
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Cancel</Button>
//           <Button variant="contained" onClick={handleSubmit} disabled={loading}>
//             {editMode ? 'Update' : 'Save'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </MainCard>
//   );
// };

// export default AcademyTopics; 