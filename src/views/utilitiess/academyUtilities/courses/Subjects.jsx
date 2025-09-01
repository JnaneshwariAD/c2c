// // src/views/Subjects/Subjects.jsx
// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Grid,
//   MenuItem,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   TextField,
//   IconButton,
//   LinearProgress,
//   FormControl,
//   InputLabel,
//   Select,
//   ToggleButton,
//   ToggleButtonGroup
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
// import MainCard from 'ui-component/cards/MainCard';
// import { gridSpacing } from 'store/constant';
// import Swal from 'sweetalert2';
// import {
//   addSubject,
//   deleteSubject,
//   fetchSubjects,
//   updateSubject
// } from 'views/API/SubjectApi';
// import { fetchAllCourses } from 'views/API/CoursesApi';
// import { useTheme } from '@mui/material/styles';
// import moment from 'moment';
// import axios from 'axios';
// import { BaseUrl } from 'BaseUrl';

// // ✅ Import SubjectCards
// import SubjectCards from './SubjectCards';

// const Subjects = () => {
//   const theme = useTheme();
//   const [subjects, setSubjects] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [subjectId, setSubjectId] = useState(null);
//   const [refresh, setRefresh] = useState(false);
//   const [viewMode, setViewMode] = useState('list');

//   const [subjectData, setSubjectData] = useState({
//     courseId: '',
//     subjectName: '',
//     description: ''
//   });

//   const [errors, setErrors] = useState({});

//   const user = JSON.parse(sessionStorage.getItem('user'));
//   const headers = {
//     'Content-type': 'application/json',
//     Authorization: 'Bearer ' + user.accessToken
//   };

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       await fetchData();
//       await fetchCourses();
//     };
//     fetchInitialData();
//   }, [refresh]);

//   const fetchCourses = async () => {
//     try {
//       const res = await fetchAllCourses(headers);
//       const fetchedData = res.data;
//       if (fetchedData) {
//         const sortedData = fetchedData.sort((a, b) =>
//           a.courseName.localeCompare(b.courseName)
//         );
//         setCourses(sortedData);
//       }
//     } catch (error) {
//       Swal.fire('Error', 'Failed to load courses', 'error');
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const res = await fetchSubjects(headers);
//       const fetchedData = res?.data?.content || [];

//       const tableData = fetchedData.map((p) => ({
//         subjectId: p.subjectId,
//         subjectName: p.subjectName,
//         courseName: p.courseDtoList?.courseName || 'No Course',
//         description: p.description,
//         insertedDate: moment(p.insertedDate).format('L'),
//         updatedDate: moment(p.updatedDate).format('L'),
//         createdBy: p.createdBy?.userName || 'No User',
//         updatedBy: p.updatedBy?.userName || 'No User'
//       }));

//       setSubjects(tableData);
//     } catch (error) {
//       Swal.fire('Error', 'Failed to fetch subjects', 'error');
//       setSubjects([]);
//     }
//   };

//   const handleDelete = async (id) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'You cannot undo this action!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete it!',
//       cancelButtonText: 'Cancel'
//     });

//     if (result.isConfirmed) {
//       try {
//         await deleteSubject(id, headers);
//         Swal.fire('Deleted!', 'Subject deleted successfully.', 'success');
//         setRefresh(!refresh);
//       } catch {
//         Swal.fire('Error', 'Failed to delete subject.', 'error');
//       }
//     }
//   };

//   const handleEdit = (subject) => {
//     setSubjectId(subject.subjectId);
//     setSubjectData({
//       courseId: courses.find((c) => c.courseName === subject.courseName)
//         ?.courseId || '',
//       subjectName: subject.subjectName,
//       description: subject.description
//     });
//     setEditMode(true);
//     setOpen(true);
//   };

//   return (
//     <MainCard
//       title={
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <span>Subjects</span>
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
//               startIcon={<AddIcon />}
//               sx={{ backgroundColor: '#03045E', '&:hover': { opacity: 0.9 } }}
//               onClick={() => {
//                 setEditMode(false);
//                 setSubjectData({
//                   courseId: '',
//                   subjectName: '',
//                   description: ''
//                 });
//                 setErrors({});
//                 setOpen(true);
//               }}
//             >
//               Add Subject
//             </Button>
//           </Box>
//         </Box>
//       }
//     >
//       {viewMode === 'list' ? (
//         <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//           <TableContainer sx={{ maxHeight: 440 }}>
//             <Table stickyHeader>
//               <TableHead >
//                 <TableRow >
//                   <TableCell  style={{   fontWeight: 600, fontSize: 15 }}>ID</TableCell>
//                   <TableCell style={{   fontWeight: 600, fontSize: 15 }}>Subject Name</TableCell>
//                   <TableCell style={{   fontWeight: 600, fontSize: 15 }} >Course</TableCell>
//                   <TableCell style={{   fontWeight: 600, fontSize: 15 }}>Description</TableCell>
//                   <TableCell style={{   fontWeight: 600, fontSize: 15 }}>Created By</TableCell>
//                   <TableCell style={{   fontWeight: 600, fontSize: 15 }}>Updated By</TableCell>
//                   <TableCell style={{   fontWeight: 600, fontSize: 15 }}>Inserted Date</TableCell>
//                   <TableCell style={{   fontWeight: 600, fontSize: 15 }}>Updated Date</TableCell>
//                   <TableCell style={{   fontWeight: 600, fontSize: 15 }}>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {subjects
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((row) => (
//                     <TableRow hover key={row.subjectId}>
//                       <TableCell>{row.subjectId}</TableCell>
//                       <TableCell>{row.subjectName}</TableCell>
//                       <TableCell>{row.courseName}</TableCell>
//                       <TableCell>{row.description}</TableCell>
//                       <TableCell>{row.createdBy}</TableCell>
//                       <TableCell>{row.updatedBy}</TableCell>
//                       <TableCell>{row.insertedDate}</TableCell>
//                       <TableCell>{row.updatedDate}</TableCell>
//                       <TableCell>
//                         <IconButton
//                           onClick={() => handleEdit(row)}
//                           sx={{ color: '#03045E' }}
//                         >
//                           <Edit />
//                         </IconButton>
//                         <IconButton
//                           onClick={() => handleDelete(row.subjectId)}
//                           color="error"
//                         >
//                           <DeleteForever />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             component="div"
//             count={subjects.length}
//             page={page}
//             onPageChange={(e, newPage) => setPage(newPage)}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={(e) => {
//               setRowsPerPage(+e.target.value);
//               setPage(0);
//             }}
//             rowsPerPageOptions={[10, 25, 100]}
//           />
//         </Paper>
//       ) : (
//         <SubjectCards
//           subjects={subjects}
//           page={page}
//           rowsPerPage={rowsPerPage}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(+e.target.value);
//             setPage(0);
//           }}
//         />
//       )}

//       {/* ✅ keep your dialog here (form remains unchanged) */}
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle>{editMode ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
//         <DialogContent>
//           <Box
//             component="form"
//             noValidate
//             autoComplete="off"
//             sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
//           >
//             <FormControl fullWidth>
//               <InputLabel id="course-label">Course</InputLabel>
//               <Select
//                 labelId="course-label"
//                 value={subjectData.courseId}
//                 label="Course"
//                 onChange={(e) =>
//                   setSubjectData({ ...subjectData, courseId: e.target.value })
//                 }
//                 required
//               >
//                 {courses.map((course) => (
//                   <MenuItem key={course.courseId} value={course.courseId}>
//                     {course.courseName}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <TextField
//               label="Subject Name"
//               value={subjectData.subjectName}
//               onChange={(e) =>
//                 setSubjectData({ ...subjectData, subjectName: e.target.value })
//               }
//               required
//               fullWidth
//             />

//             <TextField
//               label="Description"
//               value={subjectData.description}
//               onChange={(e) =>
//                 setSubjectData({ ...subjectData, description: e.target.value })
//               }
//               multiline
//               rows={3}
//               fullWidth
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={async () => {
//               // Basic validation
//               if (!subjectData.courseId || !subjectData.subjectName) {
//                 setErrors({ form: 'Course and Subject Name are required.' });
//                 return;
//               }
//               try {
//                 if (editMode) {
//                   await updateSubject(
//                     { subjectId, ...subjectData },
//                     headers
//                   );
//                 } else {
//                   await addSubject(subjectData, headers);
//                 }
//                 setOpen(false);
//                 setRefresh((r) => !r);
//               } catch (e) {
//                 // Error handled in API
//               }
//             }}
//           >
//             {editMode ? 'Update' : 'Add'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </MainCard>
//   );
// };

// export default Subjects;


// src/views/Subjects/Subjects.jsx
// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   MenuItem,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   TextField,
//   IconButton,
//   FormControl,
//   InputLabel,
//   Select,
//   ToggleButton,
//   ToggleButtonGroup
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
// import MainCard from 'ui-component/cards/MainCard';
// import Swal from 'sweetalert2';
// import {
//   addSubject,
//   deleteSubject,
//   fetchSubjects,
//   updateSubject
// } from 'views/API/SubjectApi';
// import { fetchAllCourses } from 'views/API/CoursesApi';
// import { useTheme } from '@mui/material/styles';
// import moment from 'moment';

// // ✅ Import SubjectCards
// import SubjectCards from './SubjectCards';

// const Subjects = () => {
//   const theme = useTheme();
//   const [subjects, setSubjects] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [subjectId, setSubjectId] = useState(null);
//   const [refresh, setRefresh] = useState(false);
//   const [viewMode, setViewMode] = useState('list');

//   const [subjectData, setSubjectData] = useState({
//     courseDtoList: null,
//     subjectName: '',
//     description: '',
//     semester: ''
//   });

//   const [errors, setErrors] = useState({});

//   const user = JSON.parse(sessionStorage.getItem('user'));
//   const headers = {
//     'Content-type': 'application/json',
//     Authorization: 'Bearer ' + user.accessToken
//   };

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       await fetchData();
//       await fetchCourses();
//     };
//     fetchInitialData();
//   }, [refresh]);

//   const fetchCourses = async () => {
//     try {
//       const res = await fetchAllCourses(headers);
//       const fetchedData = res.data;
//       if (fetchedData) {
//         const sortedData = fetchedData.sort((a, b) =>
//           a.courseName.localeCompare(b.courseName)
//         );
//         setCourses(sortedData);
//       }
//     } catch (error) {
//       Swal.fire('Error', 'Failed to load courses', 'error');
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const res = await fetchSubjects(headers);
//       const fetchedData = res?.data?.content || [];

//       const tableData = fetchedData.map((p) => ({
//         subjectId: p.subjectId,
//         subjectName: p.subjectName,
//         courseName: p.courseDtoList?.courseName || 'No Course',
//         description: p.description,
//         semester: p.semester,
//         insertedDate: moment(p.insertedDate).format('L'),
//         updatedDate: moment(p.updatedDate).format('L'),
//         createdBy: p.createdBy?.userName || 'No User',
//         updatedBy: p.updatedBy?.userName || 'No User',
//         courseDtoList: p.courseDtoList
//       }));

//       setSubjects(tableData);
//     } catch (error) {
//       Swal.fire('Error', 'Failed to fetch subjects', 'error');
//       setSubjects([]);
//     }
//   };

//   const handleDelete = async (id) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'You cannot undo this action!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete it!',
//       cancelButtonText: 'Cancel'
//     });

//     if (result.isConfirmed) {
//       try {
//         await deleteSubject(id, headers);
//         Swal.fire('Deleted!', 'Subject deleted successfully.', 'success');
//         setRefresh(!refresh);
//       } catch {
//         Swal.fire('Error', 'Failed to delete subject.', 'error');
//       }
//     }
//   };

//   const handleEdit = (subject) => {
//     setSubjectId(subject.subjectId);
//     setSubjectData({
//       courseDtoList:
//         courses.find((c) => c.courseId === subject.courseDtoList?.courseId) ||
//         null,
//       subjectName: subject.subjectName,
//       description: subject.description,
//       semester: subject.semester
//     });
//     setEditMode(true);
//     setOpen(true);
//   };

//   return (
//     <MainCard
//       title={
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <span>Subjects</span>
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
//               startIcon={<AddIcon />}
//               sx={{ backgroundColor: '#03045E', '&:hover': { opacity: 0.9 } }}
//               onClick={() => {
//                 setEditMode(false);
//                 setSubjectData({
//                   courseDtoList: null,
//                   subjectName: '',
//                   description: '',
//                   semester: ''
//                 });
//                 setErrors({});
//                 setOpen(true);
//               }}
//             >
//               Add Subject
//             </Button>
//           </Box>
//         </Box>
//       }
//     >
//       {viewMode === 'list' ? (
//         <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//           <TableContainer sx={{ maxHeight: 440 }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>ID</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Subject Name</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Course</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Semester</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Description</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Created By</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Updated By</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Inserted Date</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Updated Date</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {subjects
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((row) => (
//                     <TableRow hover key={row.subjectId}>
//                       <TableCell>{row.subjectId}</TableCell>
//                       <TableCell>{row.subjectName}</TableCell>
//                       <TableCell>{row.courseName}</TableCell>
//                       <TableCell>{row.semester}</TableCell>
//                       <TableCell>{row.description}</TableCell>
//                       <TableCell>{row.createdBy}</TableCell>
//                       <TableCell>{row.updatedBy}</TableCell>
//                       <TableCell>{row.insertedDate}</TableCell>
//                       <TableCell>{row.updatedDate}</TableCell>
//                       <TableCell>
//                         <IconButton
//                           onClick={() => handleEdit(row)}
//                           sx={{ color: '#03045E' }}
//                         >
//                           <Edit />
//                         </IconButton>
//                         <IconButton
//                           onClick={() => handleDelete(row.subjectId)}
//                           color="error"
//                         >
//                           <DeleteForever />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             component="div"
//             count={subjects.length}
//             page={page}
//             onPageChange={(e, newPage) => setPage(newPage)}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={(e) => {
//               setRowsPerPage(+e.target.value);
//               setPage(0);
//             }}
//             rowsPerPageOptions={[10, 25, 100]}
//           />
//         </Paper>
//       ) : (
//         <SubjectCards
//           subjects={subjects}
//           page={page}
//           rowsPerPage={rowsPerPage}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(+e.target.value);
//             setPage(0);
//           }}
//         />
//       )}

//       {/* ✅ Dialog with updated payload */}
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle>{editMode ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
//         <DialogContent>
         
//           <Box
//   component="form"
//   noValidate
//   autoComplete="off"
//   sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
// >
//   <FormControl fullWidth>
//     <InputLabel id="course-label">Course</InputLabel>
//     <Select
//       labelId="course-label"
//       value={subjectData.courseDtoList?.courseId || ''}
//       label="Course"
//       onChange={(e) => {
//         const selectedCourse = courses.find(
//           (c) => c.courseId === e.target.value
//         );
//         setSubjectData({ 
//           ...subjectData, 
//           courseDtoList: selectedCourse,
//           semester: '' // reset semester when course changes
//         });
//       }}
//       required
//     >
//       {courses.map((course) => (
//         <MenuItem key={course.courseId} value={course.courseId}>
//           {course.courseName}
//         </MenuItem>
//       ))}
//     </Select>
//   </FormControl>

//   {/* ✅ Semester dropdown */}
//   <FormControl fullWidth disabled={!subjectData.courseDtoList}>
//     <InputLabel id="semester-label">Semester</InputLabel>
//     <Select
//       labelId="semester-label"
//       value={subjectData.semester || ''}
//       onChange={(e) =>
//         setSubjectData({ ...subjectData, semester: e.target.value })
//       }
//       required
//     >
//       {subjectData.courseDtoList &&
//         Array.from(
//           { length: subjectData.courseDtoList.noOfSem },
//           (_, i) => i + 1
//         ).map((sem) => (
//           <MenuItem key={sem} value={sem}>
//              {sem}
//           </MenuItem>
//         ))}
//     </Select>
//   </FormControl>

//   <TextField
//     label="Subject Name"
//     value={subjectData.subjectName}
//     onChange={(e) =>
//       setSubjectData({ ...subjectData, subjectName: e.target.value })
//     }
//     required
//     fullWidth
//   />

//   <TextField
//     label="Description"
//     value={subjectData.description}
//     onChange={(e) =>
//       setSubjectData({ ...subjectData, description: e.target.value })
//     }
//     multiline
//     rows={3}
//     fullWidth
//   />
// </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={async () => {
//               if (!subjectData.courseDtoList || !subjectData.subjectName || !subjectData.semester) {
//   setErrors({ form: 'Course, Semester, and Subject Name are required.' });
//   return;
// }

//               try {
//                 const payload = {
//   subjectId: editMode ? subjectId : undefined,
//   subjectName: subjectData.subjectName,
//   description: subjectData.description,
//   semester: subjectData.semester,
//   courseDtoList: {
//     courseId: subjectData.courseDtoList.courseId
//   }
// };

//                 if (editMode) {
//                   await updateSubject(payload, headers);
//                 } else {
//                   await addSubject(payload, headers);
//                 }
//                 setOpen(false);
//                 setRefresh((r) => !r);
//               } catch (e) {
//                 // API error handled elsewhere
//               }
//             }}
//           >
//             {editMode ? 'Update' : 'Add'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </MainCard>
//   );
// };

// export default Subjects;

// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   MenuItem,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   TextField,
//   IconButton,
//   FormControl,
//   InputLabel,
//   Select,
//   ToggleButton,
//   ToggleButtonGroup
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
// import MainCard from 'ui-component/cards/MainCard';
// import Swal from 'sweetalert2';
// import {
//   addSubject,
//   deleteSubject,
//   fetchSubjects,
//   updateSubject
// } from 'views/API/SubjectApi';
// import { fetchAllCourses } from 'views/API/CoursesApi';
// import { useTheme } from '@mui/material/styles';
// import moment from 'moment';

// // ✅ Import SubjectCards
// import SubjectCards from './SubjectCards';

// const Subjects = () => {
//   const theme = useTheme();
//   const [subjects, setSubjects] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [subjectId, setSubjectId] = useState(null);
//   const [refresh, setRefresh] = useState(false);
//   const [viewMode, setViewMode] = useState('list');

//   const [subjectData, setSubjectData] = useState({
//     courseDtoList: null,
//     subjectName: '',
//     description: '',
//     semester: ''
//   });

//   const [errors, setErrors] = useState({});

//   const user = JSON.parse(sessionStorage.getItem('user'));
//   const headers = {
//     'Content-type': 'application/json',
//     Authorization: 'Bearer ' + user.accessToken
//   };

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       await fetchData();
//       await fetchCourses();
//     };
//     fetchInitialData();
//   }, [refresh]);

//   const fetchCourses = async () => {
//     try {
//       const res = await fetchAllCourses(headers);
//       const fetchedData = res.data;
//       if (fetchedData) {
//         const sortedData = fetchedData.sort((a, b) =>
//           a.courseName.localeCompare(b.courseName)
//         );
//         setCourses(sortedData);
//       }
//     } catch (error) {
//       Swal.fire('Error', 'Failed to load courses', 'error');
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const res = await fetchSubjects(headers);
//       const fetchedData = res?.data?.content || [];

//       const tableData = fetchedData.map((p) => ({
//         subjectId: p.subjectId,
//         subjectName: p.subjectName,
//         courseName: p.courseDtoList?.courseName || 'No Course',
//         description: p.description,
//         semester: p.semester,
//         insertedDate: moment(p.insertedDate).format('L'),
//         updatedDate: moment(p.updatedDate).format('L'),
//         createdBy: p.createdBy?.userName || 'No User',
//         updatedBy: p.updatedBy?.userName || 'No User',
//         courseDtoList: p.courseDtoList
//       }));

//       setSubjects(tableData);
//     } catch (error) {
//       Swal.fire('Error', 'Failed to fetch subjects', 'error');
//       setSubjects([]);
//     }
//   };

//   const postData = async (e) => {
//   e.preventDefault();

//   // Validate form
//   const validationErrors = {};
//   if (!subjectData.courseDtoList || !subjectData.subjectName || !subjectData.semester) {
//     validationErrors.form = "Course, Semester, and Subject Name are required.";
//   }

//   if (Object.keys(validationErrors).length > 0) {
//     setErrors(validationErrors);
//     return;
//   }

//   // Prepare payload
//   const payload = {
//     subjectId: editMode ? subjectId : undefined,
//     subjectName: subjectData.subjectName,
//     description: subjectData.description,
//     semester: subjectData.semester,
//     courseDtoList: [
//       {
//       courseId: subjectData.courseDtoList.courseId
//     }
//     ],
//     createdBy: { userId: user.userId }
//   };
// //  insertedDate: moment(p.insertedDate).format('L'),
// //         updatedDate: moment(p.updatedDate).format('L'),
// //         createdBy: p.createdBy?.userName || 'No User',
// //         updatedBy: p.updatedBy?.userName || 'No User',
// //         courseDtoList: p.courseDtoList
//   try {
//     let res;
//     if (editMode) {
//       res = await updateSubject(payload, headers);
//     } else {
//       res = await addSubject(payload, headers);
//     }

//     if (res?.data?.responseCode === 201 || res?.status === 200) {
//       setRefresh((r) => !r);
//       setOpen(false);
//     } else {
//       Swal.fire("Error", res?.data?.errorMessage || "Failed to save subject", "error");
//     }
//   } catch (err) {
//     console.error(err);
//     Swal.fire("Error", "Failed to save subject", "error");
//   }
// };


//   const handleDelete = async (id) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'You cannot undo this action!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete it!',
//       cancelButtonText: 'Cancel'
//     });

//     if (result.isConfirmed) {
//       try {
//         await deleteSubject(id, headers);
//         Swal.fire('Deleted!', 'Subject deleted successfully.', 'success');
//         setRefresh(!refresh);
//       } catch {
//         Swal.fire('Error', 'Failed to delete subject.', 'error');
//       }
//     }
//   };

//   const handleEdit = (subject) => {
//     setSubjectId(subject.subjectId);
//     setSubjectData({
//       courseDtoList:
//         courses.find((c) => c.courseId === subject.courseDtoList?.courseId) ||
//         null,
//       subjectName: subject.subjectName,
//       description: subject.description,
//       semester: subject.semester
//     });
//     setEditMode(true);
//     setOpen(true);
//   };

//   return (
//     <MainCard
//       title={
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <span>Subjects</span>
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
//               startIcon={<AddIcon />}
//               sx={{ backgroundColor: '#03045E', '&:hover': { opacity: 0.9 } }}
//               onClick={() => {
//                 setEditMode(false);
//                 setSubjectData({
//                   courseDtoList: null,
//                   subjectName: '',
//                   description: '',
//                   semester: ''
//                 });
//                 setErrors({});
//                 setOpen(true);
//               }}
//             >
//               Add Subject
//             </Button>
//           </Box>
//         </Box>
//       }
//     >
//       {viewMode === 'list' ? (
//         <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//           <TableContainer sx={{ maxHeight: 440 }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>ID</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Subject Name</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Course</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Semester</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Description</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Created By</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Updated By</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Inserted Date</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Updated Date</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {subjects
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((row) => (
//                     <TableRow hover key={row.subjectId}>
//                       <TableCell>{row.subjectId}</TableCell>
//                       <TableCell>{row.subjectName}</TableCell>
//                       <TableCell>{row.courseName}</TableCell>
//                       <TableCell>{row.semester}</TableCell>
//                       <TableCell>{row.description}</TableCell>
//                       <TableCell>{row.createdBy}</TableCell>
//                       <TableCell>{row.updatedBy}</TableCell>
//                       <TableCell>{row.insertedDate}</TableCell>
//                       <TableCell>{row.updatedDate}</TableCell>
//                       <TableCell>
//                         <IconButton
//                           onClick={() => handleEdit(row)}
//                           sx={{ color: '#03045E' }}
//                         >
//                           <Edit />
//                         </IconButton>
//                         <IconButton
//                           onClick={() => handleDelete(row.subjectId)}
//                           color="error"
//                         >
//                           <DeleteForever />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             component="div"
//             count={subjects.length}
//             page={page}
//             onPageChange={(e, newPage) => setPage(newPage)}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={(e) => {
//               setRowsPerPage(+e.target.value);
//               setPage(0);
//             }}
//             rowsPerPageOptions={[10, 25, 100]}
//           />
//         </Paper>
//       ) : (
//         <SubjectCards
//           subjects={subjects}
//           page={page}
//           rowsPerPage={rowsPerPage}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(+e.target.value);
//             setPage(0);
//           }}
//         />
//       )}

//       {/* ✅ Dialog with corrected payload */}
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle>{editMode ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
//         <DialogContent>
//           <Box
//             component="form"
//             noValidate
//             autoComplete="off"
//             sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
//           >
//             <FormControl fullWidth>
//               <InputLabel id="course-label">Course</InputLabel>
//               <Select
//                 labelId="course-label"
//                 value={subjectData.courseDtoList?.courseId || ''}
//                 onChange={(e) => {
//                   const selectedCourse = courses.find(
//                     (c) => c.courseId === e.target.value
//                   );
//                   setSubjectData({
//                     ...subjectData,
//                     courseDtoList: selectedCourse,
//                     semester: '' // reset semester when course changes
//                   });
//                 }}
//                 required
//               >
//                 {courses.map((course) => (
//                   <MenuItem key={course.courseId} value={course.courseId}>
//                     {course.courseName}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             {/* ✅ Semester dropdown */}
//             <FormControl fullWidth disabled={!subjectData.courseDtoList}>
//               <InputLabel id="semester-label">Semester</InputLabel>
//               <Select
//                 labelId="semester-label"
//                 value={subjectData.semester || ''}
//                 onChange={(e) =>
//                   setSubjectData({ ...subjectData, semester: e.target.value })
//                 }
//                 required
//               >
//                 {subjectData.courseDtoList &&
//                   Array.from(
//                     { length: subjectData.courseDtoList.noOfSem },
//                     (_, i) => i + 1
//                   ).map((sem) => (
//                     <MenuItem key={sem} value={sem}>
//                       {sem}
//                     </MenuItem>
//                   ))}
//               </Select>
//             </FormControl>

//             <TextField
//               label="Subject Name"
//               value={subjectData.subjectName}
//               onChange={(e) =>
//                 setSubjectData({ ...subjectData, subjectName: e.target.value })
//               }
//               required
//               fullWidth
//             />

//             <TextField
//               label="Description"
//               value={subjectData.description}
//               onChange={(e) =>
//                 setSubjectData({ ...subjectData, description: e.target.value })
//               }
//               multiline
//               rows={3}
//               fullWidth
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={postData}
//           >
//             {editMode ? 'Update' : 'Add'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </MainCard>
//   );
// };

// export default Subjects;


// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   MenuItem,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   TextField,
//   IconButton,
//   FormControl,
//   InputLabel,
//   Select,
//   ToggleButton,
//   ToggleButtonGroup
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
// import MainCard from 'ui-component/cards/MainCard';
// import Swal from 'sweetalert2';
// import {
//   addSubject,
//   deleteSubject,
//   fetchSubjects,
//   updateSubject
// } from 'views/API/SubjectApi';
// import { fetchAllCourses } from 'views/API/CoursesApi';
// import { useTheme } from '@mui/material/styles';
// import moment from 'moment';

// // ✅ Import SubjectCards
// import SubjectCards from './SubjectCards';

// const Subjects = () => {
//   const theme = useTheme();
//   const [subjects, setSubjects] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [subjectId, setSubjectId] = useState(null);
//   const [refresh, setRefresh] = useState(false);
//   const [viewMode, setViewMode] = useState('list');

//   const [subjectData, setSubjectData] = useState({
//     courseDtoList: null,
//     subjectName: '',
//     description: '',
//     semester: ''
//   });

//   const [errors, setErrors] = useState({});

//   const user = JSON.parse(sessionStorage.getItem('user'));
//   const headers = {
//     'Content-type': 'application/json',
//     Authorization: 'Bearer ' + user.accessToken
//   };

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       await fetchData();
//       await fetchCourses();
//     };
//     fetchInitialData();
//   }, [refresh]);

//   const fetchCourses = async () => {
//     try {
//       const res = await fetchAllCourses(headers);
//       const fetchedData = res.data;
//       if (fetchedData) {
//         const sortedData = fetchedData.sort((a, b) =>
//           a.courseName.localeCompare(b.courseName)
//         );
//         setCourses(sortedData);
//       }
//     } catch (error) {
//       Swal.fire('Error', 'Failed to load courses', 'error');
//     }
//   };

//   // const fetchData = async () => {
//   //   try {
//   //     const res = await fetchSubjects(headers);
//   //     const fetchedData = res?.data?.content || [];

//   //     const tableData = fetchedData.map((p) => ({
//   //       subjectId: p.subjectId,
//   //       subjectName: p.subjectName,
//   //       courseName: p.courseDtoList?.courseName || 'No Course',
//   //       description: p.description,
//   //       semester: p.semester,
//   //       insertedDate: moment(p.insertedDate).format('L'),
//   //       updatedDate: moment(p.updatedDate).format('L'),
//   //       createdBy: p.createdBy?.userName || 'No User',
//   //       updatedBy: p.updatedBy?.userName || 'No User',
//   //       courseDtoList: p.courseDtoList
//   //     }));

//   //     setSubjects(tableData);
//   //   } catch (error) {
//   //     Swal.fire('Error', 'Failed to fetch subjects', 'error');
//   //     setSubjects([]);
//   //   }
//   // };

//   const fetchData = async () => {
//   try {
//     const res = await fetchSubjects(headers);
//     const fetchedData = res?.data?.content || [];

//     // Sort data by subjectId in ascending order
//     const sortedData = fetchedData.sort((a, b) => a.subjectId - b.subjectId);
    
//     // Add sequential number for display
//     const tableData = sortedData.map((p, index) => ({
//       seqId: index + 1, // Add sequential ID
//       subjectId: p.subjectId,
//       subjectName: p.subjectName,
//       courseName: p.courseDtoList?.courseName || 'No Course',
//       description: p.description,
//       semester: p.semester,
//       insertedDate: moment(p.insertedDate).format('L'),
//       updatedDate: moment(p.updatedDate).format('L'),
//       createdBy: p.createdBy?.userName || 'No User',
//       updatedBy: p.updatedBy?.userName || 'No User',
//       courseDtoList: p.courseDtoList
//     }));

//     setSubjects(tableData);
//   } catch (error) {
//     Swal.fire('Error', 'Failed to fetch subjects', 'error');
//     setSubjects([]);
//   }
// };


//   const postData = async (e) => {
//     e.preventDefault();

//     // Validate form
//     const validationErrors = {};
//     if (!subjectData.courseDtoList || !subjectData.subjectName || !subjectData.semester) {
//       validationErrors.form = "Course, Semester, and Subject Name are required.";
//     }

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     // Prepare payload according to API requirements
//     const payload = {
//       subjectId: editMode ? subjectId : undefined,
//       subjectName: subjectData.subjectName,
//       description: subjectData.description,
//       semester: parseInt(subjectData.semester),
//       courseDtoList: subjectData.courseDtoList,
//       createdBy: { 
//         userId: user.userId,
//         userName: user.userName,
//         fullName: user.fullName || '',
//         mobileNumber: user.mobileNumber || ''
//       }
//     };

//     // For update, we need to include updatedBy field
//     if (editMode) {
//       payload.updatedBy = {
//         userId: user.userId,
//         userName: user.userName,
//         fullName: user.fullName || '',
//         mobileNumber: user.mobileNumber || ''
//       };
      
//       // For updates, we might need to send the full course object structure
//       // Let's reconstruct it to match the API expectations
//       payload.courseDtoList = {
//         courseId: subjectData.courseDtoList.courseId,
//         courseName: subjectData.courseDtoList.courseName,
//         noOfSem: subjectData.courseDtoList.noOfSem
//       };
//     }

//     try {
//       let res;
//       if (editMode) {
//         res = await updateSubject(payload, headers);
//       } else {
//         res = await addSubject(payload, headers);
//       }

//       if (res?.data?.responseCode === 201 || res?.status === 200 || res?.data?.responseCode === 200) {
//         setRefresh((r) => !r);
//         setOpen(false);
//         Swal.fire("Success", `Subject ${editMode ? 'updated' : 'added'} successfully!`, "success");
//       } else {
//         Swal.fire("Error", res?.data?.errorMessage || "Failed to save subject", "error");
//       }
//     } catch (err) {
//       console.error("API Error:", err);
//       Swal.fire("Error", err.response?.data?.message || "Failed to save subject", "error");
//     }
//   };

//   const handleDelete = async (id) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'You cannot undo this action!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete it!',
//       cancelButtonText: 'Cancel'
//     });

//     if (result.isConfirmed) {
//       try {
//         await deleteSubject(id, headers);
//         Swal.fire('Deleted!', 'Subject deleted successfully.', 'success');
//         setRefresh(!refresh);
//       } catch {
//         Swal.fire('Error', 'Failed to delete subject.', 'error');
//       }
//     }
//   };

//   const handleEdit = (subject) => {
//     setSubjectId(subject.subjectId);
//     setSubjectData({
//       courseDtoList: subject.courseDtoList,
//       subjectName: subject.subjectName,
//       description: subject.description,
//       semester: subject.semester.toString()
//     });
//     setEditMode(true);
//     setOpen(true);
//   };

//   return (
//     <MainCard
//       title={
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <span>Subjects</span>
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
//               startIcon={<AddIcon />}
//               sx={{ backgroundColor: '#03045E', '&:hover': { opacity: 0.9 } }}
//               onClick={() => {
//                 setEditMode(false);
//                 setSubjectData({
//                   courseDtoList: null,
//                   subjectName: '',
//                   description: '',
//                   semester: ''
//                 });
//                 setErrors({});
//                 setOpen(true);
//               }}
//             >
//               Add Subject
//             </Button>
//           </Box>
//         </Box>
//       }
//     >
//       {viewMode === 'list' ? (
//         <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//           <TableContainer sx={{ maxHeight: 440 }}>
//             <Table stickyHeader>
//               <TableHead>
//                 {/* <TableRow>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>ID</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Subject Name</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Course</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Semester</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Description</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Created By</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Updated By</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Inserted Date</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Updated Date</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Actions</TableCell>
//                 </TableRow> */}

//                 <TableRow hover key={row.subjectId}>
//   <TableCell>{row.seqId}</TableCell> {/* Changed from row.subjectId */}
//   <TableCell>{row.subjectName}</TableCell>
//   <TableCell>{row.courseName}</TableCell>
//   <TableCell>{row.semester}</TableCell>
//   <TableCell>{row.description}</TableCell>
//   <TableCell>{row.createdBy}</TableCell>
//   <TableCell>{row.updatedBy}</TableCell>
//   <TableCell>{row.insertedDate}</TableCell>
//   <TableCell>{row.updatedDate}</TableCell>
//   <TableCell>
//     <IconButton
//       onClick={() => handleEdit(row)}
//       sx={{ color: '#03045E' }}
//     >
//       <Edit />
//     </IconButton>
//     <IconButton
//       onClick={() => handleDelete(row.subjectId)}
//       color="error"
//     >
//       <DeleteForever />
//     </IconButton>
//   </TableCell>
// </TableRow>

//               </TableHead>
//               <TableBody>
//                 {subjects
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((row, index) => (
//                     <TableRow hover key={row.subjectId}>
//                       <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                       <TableCell>{row.subjectId}</TableCell>
//                       <TableCell>{row.subjectName}</TableCell>
//                       <TableCell>{row.courseName}</TableCell>
//                       <TableCell>{row.semester}</TableCell>
//                       <TableCell>{row.description}</TableCell>
//                       <TableCell>{row.createdBy}</TableCell>
//                       <TableCell>{row.updatedBy}</TableCell>
//                       <TableCell>{row.insertedDate}</TableCell>
//                       <TableCell>{row.updatedDate}</TableCell>
//                       <TableCell>
//                         <IconButton
//                           onClick={() => handleEdit(row)}
//                           sx={{ color: '#03045E' }}
//                         >
//                           <Edit />
//                         </IconButton>
//                         <IconButton
//                           onClick={() => handleDelete(row.subjectId)}
//                           color="error"
//                         >
//                           <DeleteForever />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             component="div"
//             count={subjects.length}
//             page={page}
//             onPageChange={(e, newPage) => setPage(newPage)}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={(e) => {
//               setRowsPerPage(+e.target.value);
//               setPage(0);
//             }}
//             rowsPerPageOptions={[10, 25, 100]}
//           />
//         </Paper>
//       ) : (
//         <SubjectCards
//           subjects={subjects}
//           page={page}
//           rowsPerPage={rowsPerPage}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(+e.target.value);
//             setPage(0);
//           }}
//         />
//       )}

//       {/* ✅ Dialog with corrected payload */}
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle>{editMode ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
//         <DialogContent>
//           <Box
//             component="form"
//             noValidate
//             autoComplete="off"
//             sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
//           >
//             <FormControl fullWidth>
//               <InputLabel id="course-label">Course</InputLabel>
//               <Select
//                 labelId="course-label"
//                 value={subjectData.courseDtoList?.courseId || ''}
//                 onChange={(e) => {
//                   const selectedCourse = courses.find(
//                     (c) => c.courseId === e.target.value
//                   );
//                   setSubjectData({
//                     ...subjectData,
//                     courseDtoList: selectedCourse,
//                     semester: '' // reset semester when course changes
//                   });
//                 }}
//                 required
//               >
//                 {courses.map((course) => (
//                   <MenuItem key={course.courseId} value={course.courseId}>
//                     {course.courseName}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             {/* ✅ Semester dropdown */}
//             <FormControl fullWidth disabled={!subjectData.courseDtoList}>
//               <InputLabel id="semester-label">Semester</InputLabel>
//               <Select
//                 labelId="semester-label"
//                 value={subjectData.semester || ''}
//                 onChange={(e) =>
//                   setSubjectData({ ...subjectData, semester: e.target.value })
//                 }
//                 required
//               >
//                 {subjectData.courseDtoList &&
//                   Array.from(
//                     { length: subjectData.courseDtoList.noOfSem },
//                     (_, i) => i + 1
//                   ).map((sem) => (
//                     <MenuItem key={sem} value={sem.toString()}>
//                       {sem}
//                     </MenuItem>
//                   ))}
//               </Select>
//             </FormControl>

//             <TextField
//               label="Subject Name"
//               value={subjectData.subjectName}
//               onChange={(e) =>
//                 setSubjectData({ ...subjectData, subjectName: e.target.value })
//               }
//               required
//               fullWidth
//             />

//             <TextField
//               label="Description"
//               value={subjectData.description}
//               onChange={(e) =>
//                 setSubjectData({ ...subjectData, description: e.target.value })
//               }
//               multiline
//               rows={3}
//               fullWidth
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={postData}
//           >
//             {editMode ? 'Update' : 'Add'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </MainCard>
//   );
// };

// export default Subjects;

// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   MenuItem,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   TextField,
//   IconButton,
//   FormControl,
//   InputLabel,
//   Select,
//   ToggleButton,
//   ToggleButtonGroup
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
// import MainCard from 'ui-component/cards/MainCard';
// import Swal from 'sweetalert2';
// import {
//   addSubject,
//   deleteSubject,
//   fetchSubjects,
//   updateSubject
// } from 'views/API/SubjectApi';
// import { fetchAllCourses } from 'views/API/CoursesApi';
// import { useTheme } from '@mui/material/styles';
// import moment from 'moment';

// // ✅ Import SubjectCards
// import SubjectCards from './SubjectCards';

// const Subjects = () => {
//   const theme = useTheme();
//   const [subjects, setSubjects] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [subjectId, setSubjectId] = useState(null);
//   const [refresh, setRefresh] = useState(false);
//   const [viewMode, setViewMode] = useState('list');

//   const [subjectData, setSubjectData] = useState({
//     courseDtoList: null,
//     subjectName: '',
//     description: '',
//     semester: ''
//   });

//   const [errors, setErrors] = useState({});

//   const user = JSON.parse(sessionStorage.getItem('user'));
//   const headers = {
//     'Content-type': 'application/json',
//     Authorization: 'Bearer ' + user.accessToken
//   };

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       await fetchData();
//       await fetchCourses();
//     };
//     fetchInitialData();
//   }, [refresh]);

//   const fetchCourses = async () => {
//     try {
//       const res = await fetchAllCourses(headers);
//       const fetchedData = res.data;
//       if (fetchedData) {
//         const sortedData = fetchedData.sort((a, b) =>
//           a.courseName.localeCompare(b.courseName)
//         );
//         setCourses(sortedData);
//       }
//     } catch (error) {
//       Swal.fire('Error', 'Failed to load courses', 'error');
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const res = await fetchSubjects(headers);
//       const fetchedData = res?.data?.content || [];

//       // Sort by subjectId in ascending order
//       const sortedData = fetchedData.sort((a, b) => a.subjectId - b.subjectId);

//       const tableData = sortedData.map((p, index) => ({
//         seqId: index + 1, // Add sequential ID for display
//         subjectId: p.subjectId,
//         subjectName: p.subjectName,
//         courseName: p.courseDtoList?.courseName || 'No Course',
//         description: p.description,
//         semester: p.semester,
//         insertedDate: moment(p.insertedDate).format('L'),
//         updatedDate: moment(p.updatedDate).format('L'),
//         createdBy: p.createdBy?.userName || 'No User',
//         updatedBy: p.updatedBy?.userName || 'No User',
//         courseDtoList: p.courseDtoList
//       }));

//       setSubjects(tableData);
//     } catch (error) {
//       Swal.fire('Error', 'Failed to fetch subjects', 'error');
//       setSubjects([]);
//     }
//   };

//   const postData = async (e) => {
//     e.preventDefault();

//     // Validate form
//     const validationErrors = {};
//     if (!subjectData.courseDtoList || !subjectData.subjectName || !subjectData.semester) {
//       validationErrors.form = "Course, Semester, and Subject Name are required.";
//     }

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     // Prepare payload according to API requirements
//     const payload = {
//       subjectId: editMode ? subjectId : undefined,
//       subjectName: subjectData.subjectName,
//       description: subjectData.description,
//       semester: parseInt(subjectData.semester),
//       courseDtoList: subjectData.courseDtoList,
//       createdBy: { 
//         userId: user.userId,
//         userName: user.userName,
//         fullName: user.fullName || '',
//         mobileNumber: user.mobileNumber || ''
//       }
//     };

//     // For update, we need to include updatedBy field
//     if (editMode) {
//       payload.updatedBy = {
//         userId: user.userId,
//         userName: user.userName,
//         fullName: user.fullName || '',
//         mobileNumber: user.mobileNumber || ''
//       };
      
//       // For updates, we might need to send the full course object structure
//       // Let's reconstruct it to match the API expectations
//       payload.courseDtoList = {
//         courseId: subjectData.courseDtoList.courseId,
//         courseName: subjectData.courseDtoList.courseName,
//         noOfSem: subjectData.courseDtoList.noOfSem
//       };
//     }

//     try {
//       let res;
//       if (editMode) {
//         res = await updateSubject(payload, headers);
//       } else {
//         res = await addSubject(payload, headers);
//       }

//       if (res?.data?.responseCode === 201 || res?.status === 200 || res?.data?.responseCode === 200) {
//         setRefresh((r) => !r);
//         setOpen(false);
//         Swal.fire("Success", `Subject ${editMode ? 'updated' : 'added'} successfully!`, "success");
//       } else {
//         Swal.fire("Error", res?.data?.errorMessage || "Failed to save subject", "error");
//       }
//     } catch (err) {
//       console.error("API Error:", err);
//       Swal.fire("Error", err.response?.data?.message || "Failed to save subject", "error");
//     }
//   };

//   const handleDelete = async (id) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'You cannot undo this action!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete it!',
//       cancelButtonText: 'Cancel'
//     });

//     if (result.isConfirmed) {
//       try {
//         await deleteSubject(id, headers);
//         Swal.fire('Deleted!', 'Subject deleted successfully.', 'success');
//         setRefresh(!refresh);
//       } catch {
//         Swal.fire('Error', 'Failed to delete subject.', 'error');
//       }
//     }
//   };

//   const handleEdit = (subject) => {
//     setSubjectId(subject.subjectId);
//     setSubjectData({
//       courseDtoList: subject.courseDtoList,
//       subjectName: subject.subjectName,
//       description: subject.description,
//       semester: subject.semester.toString()
//     });
//     setEditMode(true);
//     setOpen(true);
//   };

//   return (
//     <MainCard
//       title={
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <span>Subjects</span>
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
//               startIcon={<AddIcon />}
//               sx={{ backgroundColor: '#03045E', '&:hover': { opacity: 0.9 } }}
//               onClick={() => {
//                 setEditMode(false);
//                 setSubjectData({
//                   courseDtoList: null,
//                   subjectName: '',
//                   description: '',
//                   semester: ''
//                 });
//                 setErrors({});
//                 setOpen(true);
//               }}
//             >
//               Add Subject
//             </Button>
//           </Box>
//         </Box>
//       }
//     >
//       {viewMode === 'list' ? (
//         <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//           <TableContainer sx={{ maxHeight: 440 }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>#</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>ID</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Subject Name</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Course</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Semester</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Description</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Created By</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Updated By</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Inserted Date</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Updated Date</TableCell>
//                   <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {subjects
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((row) => (
//                     <TableRow hover key={row.subjectId}>
//                       <TableCell>{row.seqId}</TableCell>
//                       <TableCell>{row.subjectId}</TableCell>
//                       <TableCell>{row.subjectName}</TableCell>
//                       <TableCell>{row.courseName}</TableCell>
//                       <TableCell>{row.semester}</TableCell>
//                       <TableCell>{row.description}</TableCell>
//                       <TableCell>{row.createdBy}</TableCell>
//                       <TableCell>{row.updatedBy}</TableCell>
//                       <TableCell>{row.insertedDate}</TableCell>
//                       <TableCell>{row.updatedDate}</TableCell>
//                       <TableCell>
//                         <IconButton
//                           onClick={() => handleEdit(row)}
//                           sx={{ color: '#03045E' }}
//                         >
//                           <Edit />
//                         </IconButton>
//                         <IconButton
//                           onClick={() => handleDelete(row.subjectId)}
//                           color="error"
//                         >
//                           <DeleteForever />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             component="div"
//             count={subjects.length}
//             page={page}
//             onPageChange={(e, newPage) => setPage(newPage)}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={(e) => {
//               setRowsPerPage(+e.target.value);
//               setPage(0);
//             }}
//             rowsPerPageOptions={[10, 25, 100]}
//           />
//         </Paper>
//       ) : (
//         <SubjectCards
//           subjects={subjects}
//           page={page}
//           rowsPerPage={rowsPerPage}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(+e.target.value);
//             setPage(0);
//           }}
//         />
//       )}

//       {/* ✅ Dialog with corrected payload */}
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle>{editMode ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
//         <DialogContent>
//           <Box
//             component="form"
//             noValidate
//             autoComplete="off"
//             sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
//           >
//             <FormControl fullWidth>
//               <InputLabel id="course-label">Course</InputLabel>
//               <Select
//                 labelId="course-label"
//                 value={subjectData.courseDtoList?.courseId || ''}
//                 onChange={(e) => {
//                   const selectedCourse = courses.find(
//                     (c) => c.courseId === e.target.value
//                   );
//                   setSubjectData({
//                     ...subjectData,
//                     courseDtoList: selectedCourse,
//                     semester: '' // reset semester when course changes
//                   });
//                 }}
//                 required
//               >
//                 {courses.map((course) => (
//                   <MenuItem key={course.courseId} value={course.courseId}>
//                     {course.courseName}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             {/* ✅ Semester dropdown */}
//             <FormControl fullWidth disabled={!subjectData.courseDtoList}>
//               <InputLabel id="semester-label">Semester</InputLabel>
//               <Select
//                 labelId="semester-label"
//                 value={subjectData.semester || ''}
//                 onChange={(e) =>
//                   setSubjectData({ ...subjectData, semester: e.target.value })
//                 }
//                 required
//               >
//                 {subjectData.courseDtoList &&
//                   Array.from(
//                     { length: subjectData.courseDtoList.noOfSem },
//                     (_, i) => i + 1
//                   ).map((sem) => (
//                     <MenuItem key={sem} value={sem.toString()}>
//                       {sem}
//                     </MenuItem>
//                   ))}
//               </Select>
//             </FormControl>

//             <TextField
//               label="Subject Name"
//               value={subjectData.subjectName}
//               onChange={(e) =>
//                 setSubjectData({ ...subjectData, subjectName: e.target.value })
//               }
//               required
//               fullWidth
//             />

//             <TextField
//               label="Description"
//               value={subjectData.description}
//               onChange={(e) =>
//                 setSubjectData({ ...subjectData, description: e.target.value })
//               }
//               multiline
//               rows={3}
//               fullWidth
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={postData}
//           >
//             {editMode ? 'Update' : 'Add'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </MainCard>
//   );
// };

// export default Subjects;


import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  FormControl,
  InputLabel,
  Select,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
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
    courseDtoList: null,
    subjectName: '',
    description: '',
    semester: ''
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

      // Sort by subjectId in ascending order
      const sortedData = fetchedData.sort((a, b) => a.subjectId - b.subjectId);

      const tableData = sortedData.map((p, index) => ({
        seqId: index + 1, // Add sequential ID for display
        subjectId: p.subjectId,
        subjectName: p.subjectName,
        courseName: p.courseDtoList?.courseName || 'No Course',
        description: p.description,
        semester: p.semester,
        insertedDate: moment(p.insertedDate).format('L'),
        updatedDate: moment(p.updatedDate).format('L'),
        createdBy: p.createdBy?.userName || 'No User',
        updatedBy: p.updatedBy?.userName || 'No User',
        courseDtoList: p.courseDtoList
      }));

      setSubjects(tableData);
    } catch (error) {
      Swal.fire('Error', 'Failed to fetch subjects', 'error');
      setSubjects([]);
    }
  };

  const postData = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = {};
    if (!subjectData.courseDtoList || !subjectData.subjectName || !subjectData.semester) {
      validationErrors.form = "Course, Semester, and Subject Name are required.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare payload according to API requirements
    const payload = {
      subjectId: editMode ? subjectId : undefined,
      subjectName: subjectData.subjectName,
      description: subjectData.description,
      semester: parseInt(subjectData.semester),
      courseDtoList: subjectData.courseDtoList,
      createdBy: { 
        userId: user.userId,
        userName: user.userName,
        fullName: user.fullName || '',
        mobileNumber: user.mobileNumber || ''
      }
    };

    // For update, we need to include updatedBy field
    if (editMode) {
      payload.updatedBy = {
        userId: user.userId,
        userName: user.userName,
        fullName: user.fullName || '',
        mobileNumber: user.mobileNumber || ''
      };
      
      // For updates, we might need to send the full course object structure
      // Let's reconstruct it to match the API expectations
      payload.courseDtoList = {
        courseId: subjectData.courseDtoList.courseId,
        courseName: subjectData.courseDtoList.courseName,
        noOfSem: subjectData.courseDtoList.noOfSem
      };
    }

    try {
      let res;
      if (editMode) {
        res = await updateSubject(payload, headers);
      } else {
        res = await addSubject(payload, headers);
      }

      if (res?.data?.responseCode === 201 || res?.status === 200 || res?.data?.responseCode === 200) {
        setRefresh((r) => !r);
        setOpen(false);
        Swal.fire("Success", `Subject ${editMode ? 'updated' : 'added'} successfully!`, "success");
      } else {
        Swal.fire("Error", res?.data?.errorMessage || "Failed to save subject", "error");
      }
    } catch (err) {
      console.error("API Error:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to save subject", "error");
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
      courseDtoList: subject.courseDtoList,
      subjectName: subject.subjectName,
      description: subject.description,
      semester: subject.semester.toString()
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
                  courseDtoList: null,
                  subjectName: '',
                  description: '',
                  semester: ''
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
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 600, fontSize: 15 }}>ID</TableCell>
                  <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Subject Name</TableCell>
                  <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Course</TableCell>
                  <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Semester</TableCell>
                  <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Description</TableCell>
                  <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Created By</TableCell>
                  <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Updated By</TableCell>
                  <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Inserted Date</TableCell>
                  <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Updated Date</TableCell>
                  <TableCell style={{ fontWeight: 600, fontSize: 15 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover key={row.subjectId}>
                      <TableCell>{row.seqId}</TableCell>
                      <TableCell>{row.subjectName}</TableCell>
                      <TableCell>{row.courseName}</TableCell>
                      <TableCell>{row.semester}</TableCell>
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

      {/* ✅ Dialog with corrected payload */}
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
                value={subjectData.courseDtoList?.courseId || ''}
                onChange={(e) => {
                  const selectedCourse = courses.find(
                    (c) => c.courseId === e.target.value
                  );
                  setSubjectData({
                    ...subjectData,
                    courseDtoList: selectedCourse,
                    semester: '' // reset semester when course changes
                  });
                }}
                required
              >
                {courses.map((course) => (
                  <MenuItem key={course.courseId} value={course.courseId}>
                    {course.courseName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* ✅ Semester dropdown */}
            <FormControl fullWidth disabled={!subjectData.courseDtoList}>
              <InputLabel id="semester-label">Semester</InputLabel>
              <Select
                labelId="semester-label"
                value={subjectData.semester || ''}
                onChange={(e) =>
                  setSubjectData({ ...subjectData, semester: e.target.value })
                }
                required
              >
                {subjectData.courseDtoList &&
                  Array.from(
                    { length: subjectData.courseDtoList.noOfSem },
                    (_, i) => i + 1
                  ).map((sem) => (
                    <MenuItem key={sem} value={sem.toString()}>
                      {sem}
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
            onClick={postData}
          >
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default Subjects;