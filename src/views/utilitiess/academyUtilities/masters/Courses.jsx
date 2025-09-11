// import * as React from 'react';
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogTitle,
//   TextField,
//   Container,
//   IconButton,
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
//   FormControl
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit, Sell } from '@mui/icons-material';
// import MainCard from 'ui-component/cards/MainCard';
// import { gridSpacing } from 'store/constant';
// import { useState, useEffect } from 'react';
// import moment from 'moment';
// import { useTheme } from '@mui/material/styles';
// import { addCourse, deleteCourse, fetchCourseById, fetchCourses, updatedCourse } from 'views/API/CoursesApi';
// import { fetchAllUniversities, fetchAllCategories,  } from 'views/API/CoursesApi';
// import Swal from 'sweetalert2';
// import axios from 'axios';
// import CoursesCards from './CoursesCards';
// import ToggleButton from '@mui/material/ToggleButton';
// import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// import ViewListIcon from '@mui/icons-material/ViewList';
// import ViewModuleIcon from '@mui/icons-material/ViewModule';

// const columns = [
//   { id: 'courseId', label: 'ID' },
//   { id: 'courseName', label: 'Name', minWidth: 100 },
//   { id: 'description', label: 'Description', minWidth: 100 },
//   { id: 'noOfSem', label: 'No. of Semesters' },
//   { id: 'universityName', label: 'University' },
//   { id: 'categoryName', label: 'Category' },
//   { id: 'videoUrl', label: 'Video URL',  },
//   { id: 'createdBy', label: 'Created By' },
//   { id: 'actions', label: 'Actions', align: 'right' }
// ];


// const UpSkillCourses = () => {
//   const theme = useTheme();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [courses, setCourses] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [userdata, setUserData] = useState({
//     courseName: '',
//     description: '',
//     noOfSem: '',
//     videoUrl: '',
//     categoryId: '',
//     universityId: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [refreshTrigger, setRefreshTrigger] = useState(false);
//   const [universities, setUniversities] = useState([]);
//   const [courseId, setCourseId] = useState(null);
//   const [viewMode, setViewMode] = useState('list');

//   const user = JSON.parse(sessionStorage.getItem('user'));
//   const headers = {
//     'Content-type': 'application/json',
//     Authorization: 'Bearer ' + user?.accessToken
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await fetchAllCategories(headers);
//       const fetchedData = res.data;
//       if (fetchedData) {
//         const sortedData = fetchedData.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
//         const categoryData = sortedData.map((c) => ({
//           categoryId: c.categoryId,
//           categoryName: c.categoryName
//         }));
//         setCategories(categoryData);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   const fetchUniversities = async () => {
//     try {
//       const res = await fetchAllUniversities(headers);
//       const fetchedData = res.data;
//       if (fetchedData) {
//         const sortedData = fetchedData.sort((a, b) => a.universityName.localeCompare(b.universityName));
//         const universityData = sortedData.map((c) => ({
//           universityId: c.universityId,
//           universityName: c.universityName
//         }));
//         setUniversities(universityData);
//       }
//     } catch (error) {
//       console.error('Error fetching universities:', error);
//     }
//   };

//   const FetchData = async () => {
//     try {
//       const res = await fetchCourses(headers);
//       const fetchedData = res.data.content || res.data; // Handle both array and paginated response
//       if (fetchedData) {
//         const tableData = fetchedData.map((p) => ({
//           courseId: p.courseId,
//           courseName: p.courseName,
//           description: p.description,
//           noOfSem: p.noOfSem,
//           categoryName: p.courseCategoryDto?.categoryName || 'No Category',
//           universityName: p.universityDtoList?.universityName || 'No University',
//           videoUrl: p.videoUrl,
//           insertedDate: moment(p.insertedDate).format('L'),
//           updatedDate: moment(p.updatedDate).format('L'),
//           createdBy: p.createdBy?.userName || 'No User',
//           updatedBy: p.updatedBy?.userName || 'No User'
//         }))
//                 .sort((a, b) => a.courseId - b.courseId); // For ascending by ID

//         setCourses(tableData);
//       } else {
//         setCourses([]);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

  

//   useEffect(() => {
//     FetchData();
//     fetchCategories();
//     fetchUniversities();
//   }, [refreshTrigger]);

//   const validateForm = () => {
//     const newErrors = {};
//     if (!userdata.courseName?.trim()) newErrors.courseName = 'Course name is required';
//     if (!userdata.description?.trim()) newErrors.description = 'Description is required';
//     if (!userdata.videoUrl?.trim()) newErrors.videoUrl = 'Video URL is required';
//     if (!userdata.noOfSem || isNaN(userdata.noOfSem)) newErrors.noOfSem = 'Valid number of semesters is required';
//     if (!userdata.categoryId) newErrors.categoryId = 'Category is required';
//     if (!userdata.universityId) newErrors.universityId = 'University is required';
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

//   const handleAddCourses = () => {
//     setEditMode(false);
//     setUserData({
//       courseName: '',
//       description: '',
//       noOfSem: '',
//       videoUrl: '',
//       categoryId: '',
//       universityId: ''
//     });
//     setOpen(true);
//   };

//   const postData = async (e) => {
//   e.preventDefault();
//   const validationErrors = validateForm();
//   if (Object.keys(validationErrors).length > 0) {
//     setErrors(validationErrors);
//     return;
//   }

//   // Prepare the data object exactly as the API expects
//   const dataToPost = {
//     courseCategoryDto: {
//       categoryId: parseInt(userdata.categoryId)
//     },
//     courseName: userdata.courseName,
//     description: userdata.description,
//     videoUrl: userdata.videoUrl,
//     noOfSem: parseInt(userdata.noOfSem),

//     universityDtoList: {
//   universityId: parseInt(userdata.universityId)
// },

//     createdBy: {
//       userId: user.userId
//     }
//   };

//   console.log('Sending data:', dataToPost); // For debugging

//   try {
//     const response = await addCourse(dataToPost, headers);
//     console.log('API Response:', response); // For debugging

//     // Check for success - adjust based on actual API response
//     if (response.status === 201 || response.data?.responseCode === 201) {
//       Swal.fire({
//         icon: 'success',
//         title: 'Success',
//         text: response.data?.message || 'Course added successfully!',
//         confirmButtonColor: '#03045E'
//       });
//       setRefreshTrigger(!refreshTrigger);
//       setOpen(false);
//     } else {
//       throw new Error(response.data?.message || 'Course creation failed');
//     }
//   } catch (error) {
//     console.error('Error details:', error.response?.data || error.message);
//     Swal.fire({
//       icon: 'error',
//       title: 'Error',
//       text: error.response?.data?.message || 
//            error.response?.data?.errorMessage || 
//            'Failed to add course. Please check all fields.',
//       confirmButtonColor: '#03045E'
//     });
//   }
// };

//  const updateData = async (e) => {
//   e.preventDefault();
//   const validationErrors = validateForm();
//   if (Object.keys(validationErrors).length > 0) {
//     setErrors(validationErrors);
//     return;
//   }

//   const updatedDataPayload = {
//     courseId: courseId,
//     courseCategoryDto: {
//       categoryId: parseInt(userdata.categoryId)
//     },
//     courseName: userdata.courseName,
//     description: userdata.description,
//     videoUrl: userdata.videoUrl,
//     noOfSem: parseInt(userdata.noOfSem),
//     universityDtoList: {
//       universityId: parseInt(userdata.universityId)
//     },
//     updatedBy: {
//       userId: user.userId,
//       userName: user.userName
//     }
//   };

//   try {
//     const response = await updatedCourse(updatedDataPayload, headers);
    
//     // More flexible success condition
//     if (response.status === 200 || response.data?.responseCode === 200 || response.data?.success) {
//       Swal.fire({
//         icon: 'success',
//         title: 'Success',
//         text: response.data?.message || 'Course updated successfully!',
//         confirmButtonColor: '#03045E'
//       });
      
//       // Force refresh of data
//       setRefreshTrigger(prev => !prev);
      
//       // Reset form state
//       setOpen(false);
//       setEditMode(false);
//       setUserData({
//         courseName: '',
//         description: '',
//         noOfSem: '',
//         videoUrl: '',
//         categoryId: '',
//         universityId: ''
//       });
//     } else {
//       throw new Error(response.data?.message || 'Update failed with unknown error');
//     }
//   } catch (error) {
//     console.error('Update error:', error);
//     Swal.fire({
//       icon: 'error',
//       title: 'Error',
//       text: error.response?.data?.message || 
//            error.response?.data?.error || 
//            error.message || 
//            'Failed to update course',
//       confirmButtonColor: '#03045E'
//     });
//   }
// };
//   const handleEdit = async (courseId) => {
//     setEditMode(true);
//     setOpen(true);
//     setCourseId(courseId);
//     try {
//       const res = await fetchCourseById(courseId, headers);
//       const det = res.data;
//       setUserData({
//         courseName: det.courseName,
//         description: det.description,
//         noOfSem: det.noOfSem,
//         videoUrl: det.videoUrl,
//         categoryId: det.courseCategoryDto?.categoryId || '',
//         universityId: det.universityDtoList?.universityId || ''
//       });
//     } catch (error) {
//       console.error('Error fetching course details:', error);
//     }
//   };

//   const handleDelete = async (courseId) => {
//     try {
//       const result = await Swal.fire({
//         title: 'Are you sure?',
//         text: "This will permanently delete the course!",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#03045E',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, delete it!'
//       });

//       if (result.isConfirmed) {
//         const response = await deleteCourse(courseId, headers);
//         if (response.status === 200) {
//           Swal.fire({
//             icon: 'success',
//             title: 'Deleted!',
//             text: 'The course has been deleted.',
//             confirmButtonColor: '#03045E'
//           });
//           setRefreshTrigger(!refreshTrigger);
//         }
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: error.response?.data?.message || 'Failed to delete course',
//         confirmButtonColor: '#03045E'
//       });
//     }
//   };

//   return (
//     <div>
//       <MainCard
//         title={
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <span>Courses</span>
//             <Box display="flex" alignItems="center" gap={1}>
//               <ToggleButtonGroup
//                 value={viewMode}
//                 exclusive
//                 onChange={(e, val) => val && setViewMode(val)}
//                 size="small"
//               >
//                 <ToggleButton value="list">
//                   <ViewListIcon />
//                 </ToggleButton>
//                 <ToggleButton value="card">
//                   <ViewModuleIcon />
//                 </ToggleButton>
//               </ToggleButtonGroup>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 sx={{
//                   display: 'flex', alignItems: 'center', fontSize: '15px', backgroundColor: "#03045E",
//                   '&:hover': { backgroundColor: "#03045E", opacity: 0.9 }
//                 }}
//                 onClick={handleAddCourses}
//               >
//                 Add
//                 <AddIcon sx={{ color: '#fff' }} />
//               </Button>
//             </Box>
//           </Box>
//         }
//       >
//         <Grid container spacing={gridSpacing}></Grid>
//         {viewMode === 'list' ? (
//   <Paper sx={{ width: '100%', overflow: 'hidden' }}>

//           <TableContainer sx={{ maxHeight: 440 }}>
//             <Table stickyHeader aria-label="sticky table">
//               <TableHead>
//                 <TableRow>
//                   {columns.map((column) => (
//                     <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, fontWeight: 600, fontSize: 15 }}>
//                       {column.label}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
//                   <TableRow hover role="checkbox" tabIndex={-1} key={row.courseId}>
//                     {columns.map((column) => (
//                       <TableCell key={column.id} align={column.align}>
//                         {column.id === 'actions' ? (
//                           <>
//                             <IconButton
//                               sx={{ color: "#03045E" }}
//                               onClick={() => handleEdit(row.courseId)}
//                             >
//                               <Edit />
//                             </IconButton>
//                             <IconButton
//                               color="error"
//                               onClick={() => handleDelete(row.courseId)}
//                             >
//                               <DeleteForever />
//                             </IconButton>
//                           </>
//                         ) : column.format ? (
//                           column.format(row[column.id])
//                         ) : (
//                           row[column.id]
//                         )}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             rowsPerPageOptions={[10, 25, 100]}
//             component="div"
//             count={courses.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </Paper>
// ) : (
//   <CoursesCards
//     courses={courses}
//     page={page}
//     rowsPerPage={rowsPerPage}
//     onEdit={handleEdit}
//     onDelete={handleDelete}
//     onPageChange={handleChangePage}
//     onRowsPerPageChange={handleChangeRowsPerPage}
//   />
// )}
//         <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//           <DialogTitle sx={{ fontSize: '16px' }}>
//             {editMode ? 'Edit Course' : 'Add Course'}
//           </DialogTitle>
//           <Box component="form" onSubmit={editMode ? updateData : postData} noValidate sx={{ p: 3 }}>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Course Name"
//                   name="courseName"
//                   value={userdata.courseName}
//                   onChange={changeHandler}
//                   error={!!errors.courseName}
//                   helperText={errors.courseName}
//                   sx={{
//                     '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#03045E' } },
//                     '& .MuiInputLabel-root.Mui-focused': { color: '#03045E' },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Description"
//                   name="description"
//                   value={userdata.description}
//                   onChange={changeHandler}
//                   error={!!errors.description}
//                   helperText={errors.description}
//                   multiline
//                   rows={3}
//                   sx={{
//                     '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#03045E' } },
//                     '& .MuiInputLabel-root.Mui-focused': { color: '#03045E' },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Number of Semesters"
//                   name="noOfSem"
//                   type="number"
//                   value={userdata.noOfSem}
//                   onChange={changeHandler}
//                   error={!!errors.noOfSem}
//                   helperText={errors.noOfSem}
//                   sx={{
//                     '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#03045E' } },
//                     '& .MuiInputLabel-root.Mui-focused': { color: '#03045E' },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Video URL"
//                   name="videoUrl"
//                   value={userdata.videoUrl}
//                   onChange={changeHandler}
//                   error={!!errors.videoUrl}
//                   helperText={errors.videoUrl}
//                   sx={{
//                     '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#03045E' } },
//                     '& .MuiInputLabel-root.Mui-focused': { color: '#03045E' },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth sx={{
//                   '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#03045E' } },
//                   '& .MuiInputLabel-root.Mui-focused': { color: '#03045E' },
//                 }}>
//                   <InputLabel>Category</InputLabel>
//                   <Select
//                     name="categoryId"
//                     value={userdata.categoryId}
//                     onChange={changeHandler}
//                     error={!!errors.categoryId}
//                     label="Category"
//                   >
//                     {categories.map((category) => (
//                       <MenuItem key={category.categoryId} value={category.categoryId}>
//                         {category.categoryName}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth sx={{
//                   '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#03045E' } },
//                   '& .MuiInputLabel-root.Mui-focused': { color: '#03045E' },
//                 }}>
//                   <InputLabel>University</InputLabel>
//                   <Select
//                     name="universityId"
//                     value={userdata.universityId}
//                     onChange={changeHandler}
//                     error={!!errors.universityId}
//                     label="University"
//                   >
//                     {universities.map((university) => (
//                       <MenuItem key={university.universityId} value={university.universityId}>
//                         {university.universityName}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>
//             <DialogActions>
//               <Button onClick={() => setOpen(false)} sx={{ color: "#03045E" }}>Cancel</Button>
//               <Button type="submit" variant="contained" sx={{
//                 backgroundColor: "#03045E",
//                 '&:hover': { backgroundColor: "#03045E", opacity: 0.9 }
//               }}>
//                 {editMode ? 'Update' : 'Save'}
//               </Button>
//             </DialogActions>
//           </Box>
//         </Dialog>
//       </MainCard>
//     </div>
//   );
// };

// export default UpSkillCourses;





import * as React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  Container,
  IconButton,
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
  FormControl
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit, Sell } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import { addCourse, deleteCourse, fetchCourseById, fetchCourses, updatedCourse } from 'views/API/CoursesApi';
import { fetchAllUniversities, fetchAllCategories,  } from 'views/API/CoursesApi';
import Swal from 'sweetalert2';
import axios from 'axios';
import CoursesCards from './CoursesCards';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

const columns = [
  { id: 'index', label: 'ID' }, // Changed from 'courseId' to 'index'
  // { id: 'courseId', label: 'Course ID', hide: true }, // Hidden column for courseId
  { id: 'courseName', label: 'Name', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'noOfSem', label: 'No. of Semesters' },
  { id: 'universityName', label: 'University' },
  { id: 'categoryName', label: 'Category' },
  { id: 'videoUrl', label: 'Video URL',  },
  { id: 'createdBy', label: 'Created By' },
  { id: 'actions', label: 'Actions', align: 'right' }
];


const UpSkillCourses = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userdata, setUserData] = useState({
    courseName: '',
    description: '',
    noOfSem: '',
    videoUrl: '',
    categoryId: '',
    universityId: ''
  });
  const [errors, setErrors] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user?.accessToken
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetchAllCategories(headers);
      const fetchedData = res.data;
      if (fetchedData) {
        const sortedData = fetchedData.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
        const categoryData = sortedData.map((c) => ({
          categoryId: c.categoryId,
          categoryName: c.categoryName
        }));
        setCategories(categoryData);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchUniversities = async () => {
    try {
      const res = await fetchAllUniversities(headers);
      const fetchedData = res.data;
      if (fetchedData) {
        const sortedData = fetchedData.sort((a, b) => a.universityName.localeCompare(b.universityName));
        const universityData = sortedData.map((c) => ({
          universityId: c.universityId,
          universityName: c.universityName
        }));
        setUniversities(universityData);
      }
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  const FetchData = async () => {
    try {
      const res = await fetchCourses(headers);
      const fetchedData = res.data.content || res.data; // Handle both array and paginated response
      if (fetchedData) {
        const tableData = fetchedData.map((p) => ({
          courseId: p.courseId,
          courseName: p.courseName,
          description: p.description,
          noOfSem: p.noOfSem,
          categoryName: p.courseCategoryDto?.categoryName || 'No Category',
          universityName: p.universityDtoList?.universityName || 'No University',
          videoUrl: p.videoUrl,
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy?.userName || 'No User',
          updatedBy: p.updatedBy?.userName || 'No User'
        }))
        .sort((a, b) => a.courseId - b.courseId); // For ascending by ID

        setCourses(tableData);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    FetchData();
    fetchCategories();
    fetchUniversities();
  }, [refreshTrigger]);

  const validateForm = () => {
    const newErrors = {};
    if (!userdata.courseName?.trim()) newErrors.courseName = 'Course name is required';
    if (!userdata.description?.trim()) newErrors.description = 'Description is required';
    if (!userdata.videoUrl?.trim()) newErrors.videoUrl = 'Video URL is required';
    if (!userdata.noOfSem || isNaN(userdata.noOfSem)) newErrors.noOfSem = 'Valid number of semesters is required';
    if (!userdata.categoryId) newErrors.categoryId = 'Category is required';
    if (!userdata.universityId) newErrors.universityId = 'University is required';
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

  const handleAddCourses = () => {
    setEditMode(false);
    setUserData({
      courseName: '',
      description: '',
      noOfSem: '',
      videoUrl: '',
      categoryId: '',
      universityId: ''
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

  // Prepare the data object exactly as the API expects
  const dataToPost = {
    courseCategoryDto: {
      categoryId: parseInt(userdata.categoryId)
    },
    courseName: userdata.courseName,
    description: userdata.description,
    videoUrl: userdata.videoUrl,
    noOfSem: parseInt(userdata.noOfSem),

    universityDtoList: {
  universityId: parseInt(userdata.universityId)
},

    createdBy: {
      userId: user.userId
    }
  };

  console.log('Sending data:', dataToPost); // For debugging

  try {
    const response = await addCourse(dataToPost, headers);
    console.log('API Response:', response); // For debugging

    // Check for success - adjust based on actual API response
    if (response.status === 201 || response.data?.responseCode === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data?.message || 'Course added successfully!',
        confirmButtonColor: '#03045E'
      });
      setRefreshTrigger(!refreshTrigger);
      setOpen(false);
    } else {
      throw new Error(response.data?.message || 'Course creation failed');
    }
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 
           error.response?.data?.errorMessage || 
           'Failed to add course. Please check all fields.',
      confirmButtonColor: '#03045E'
    });
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
    courseId: courseId,
    courseCategoryDto: {
      categoryId: parseInt(userdata.categoryId)
    },
    courseName: userdata.courseName,
    description: userdata.description,
    videoUrl: userdata.videoUrl,
    noOfSem: parseInt(userdata.noOfSem),
    universityDtoList: {
      universityId: parseInt(userdata.universityId)
    },
    updatedBy: {
      userId: user.userId,
      userName: user.userName
    }
  };

  try {
    const response = await updatedCourse(updatedDataPayload, headers);
    
    // More flexible success condition
    if (response.status === 200 || response.data?.responseCode === 200 || response.data?.success) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data?.message || 'Course updated successfully!',
        confirmButtonColor: '#03045E'
      });
      
      // Force refresh of data
      setRefreshTrigger(prev => !prev);
      
      // Reset form state
      setOpen(false);
      setEditMode(false);
      setUserData({
        courseName: '',
        description: '',
        noOfSem: '',
        videoUrl: '',
        categoryId: '',
        universityId: ''
      });
    } else {
      throw new Error(response.data?.message || 'Update failed with unknown error');
    }
  } catch (error) {
    console.error('Update error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 
           error.response?.data?.error || 
           error.message || 
           'Failed to update course',
      confirmButtonColor: '#03045E'
    });
  }
};
  const handleEdit = async (courseId) => {
    setEditMode(true);
    setOpen(true);
    setCourseId(courseId);
    try {
      const res = await fetchCourseById(courseId, headers);
      const det = res.data;
      setUserData({
        courseName: det.courseName,
        description: det.description,
        noOfSem: det.noOfSem,
        videoUrl: det.videoUrl,
        categoryId: det.courseCategoryDto?.categoryId || '',
        universityId: det.universityDtoList?.universityId || ''
      });
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const handleDelete = async (courseId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This will permanently delete the course!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#03045E',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await deleteCourse(courseId, headers);
        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The course has been deleted.',
            confirmButtonColor: '#03045E'
          });
          setRefreshTrigger(!refreshTrigger);
        }
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to delete course',
        confirmButtonColor: '#03045E'
      });
    }
  };

  return (
    <div>
      <MainCard
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Courses</span>
            <Box display="flex" alignItems="center" gap={1}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, val) => val && setViewMode(val)}
                size="small"
              >
                <ToggleButton value="list">
                  <ViewListIcon />
                </ToggleButton>
                <ToggleButton value="card">
                  <ViewModuleIcon />
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  display: 'flex', alignItems: 'center', fontSize: '15px', backgroundColor: "#03045E",
                  '&:hover': { backgroundColor: "#03045E", opacity: 0.9 }
                }}
                onClick={handleAddCourses}
              >
                Add
                <AddIcon sx={{ color: '#fff' }} />
              </Button>
            </Box>
          </Box>
        }
      >
        <Grid container spacing={gridSpacing}></Grid>
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
                {courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.courseId}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'index' ? (
                          // Display sequential number instead of database ID
                          page * rowsPerPage + index + 1
                        ) : column.id === 'actions' ? (
                          <>
                            <IconButton
                              sx={{ color: "#03045E" }}
                              onClick={() => handleEdit(row.courseId)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(row.courseId)}
                            >
                              <DeleteForever />
                            </IconButton>
                          </>
                        ) : column.format ? (
                          column.format(row[column.id])
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
            count={courses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
) : (
  <CoursesCards
    courses={courses}
    page={page}
    rowsPerPage={rowsPerPage}
    onEdit={handleEdit}
    onDelete={handleDelete}
    onPageChange={handleChangePage}
    onRowsPerPageChange={handleChangeRowsPerPage}
  />
)}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
          <DialogTitle sx={{ fontSize: '16px' }}>
            {editMode ? 'Edit Course' : 'Add Course'}
          </DialogTitle>
          <Box component="form" onSubmit={editMode ? updateData : postData} noValidate sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Course Name"
                  name="courseName"
                  value={userdata.courseName}
                  onChange={changeHandler}
                  error={!!errors.courseName}
                  helperText={errors.courseName}
                  sx={{
                    '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#03045E' } },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#03045E' },
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
                    '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#03045E' } },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#03045E' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Number of Semesters"
                  name="noOfSem"
                  type="number"
                  value={userdata.noOfSem}
                  onChange={changeHandler}
                  error={!!errors.noOfSem}
                  helperText={errors.noOfSem}
                  sx={{
                    '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#03045E' } },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#03045E' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Video URL"
                  name="videoUrl"
                  value={userdata.videoUrl}
                  onChange={changeHandler}
                  error={!!errors.videoUrl}
                  helperText={errors.videoUrl}
                  sx={{
                    '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#03045E' } },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#03045E' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#03045E' } },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#03045E' },
                }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="categoryId"
                    value={userdata.categoryId}
                    onChange={changeHandler}
                    error={!!errors.categoryId}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#03045E' } },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#03045E' },
                }}>
                  <InputLabel>University</InputLabel>
                  <Select
                    name="universityId"
                    value={userdata.universityId}
                    onChange={changeHandler}
                    error={!!errors.universityId}
                    label="University"
                  >
                    {universities.map((university) => (
                      <MenuItem key={university.universityId} value={university.universityId}>
                        {university.universityName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={() => setOpen(false)} sx={{ color: "#03045E" }}>Cancel</Button>
              <Button type="submit" variant="contained" sx={{
                backgroundColor: "#03045E",
                '&:hover': { backgroundColor: "#03045E", opacity: 0.9 }
              }}>
                {editMode ? 'Update' : 'Save'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </MainCard>
    </div>
  );
};

export default UpSkillCourses;