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
import { fetchAllUniversities, fetchAllCategories, fetchAllBranches,  } from 'views/API/CoursesApi';
import Swal from 'sweetalert2';

const columns = [
  { id: 'courseId', label: 'ID' },
  { id: 'courseName', label: 'Name', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'categoryName', label: 'Category' },
  { id: 'universityName', label: 'University' },
  // { id: 'activePeriod', label: 'Active Period' },
  // { id: 'trailPeriod', label: 'Trail Period' },
  // { id: 'semester', label: 'Semester' },
  {
    id: 'videoUrl',
    label: 'Video URL',
    format: (value) => (
      value ? (
        <iframe
          width="200"
          height="100"
          src={value}
          title="Course video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : 'No video'
    )
  },
  { id: 'createdBy', label: 'Created By', align: 'right' },
  { id: 'updatedBy', label: 'Updated By', align: 'right' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
  { id: 'updatedDate', label: 'Updated Date', align: 'right' },
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
    activePeriod: '',
    trailPeriod: '',
    semester: '',
    videoUrl: '',
    categoryId: '',
    universityId: '',
  });
  const [errors, setErrors] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [universities, setuniversities] = useState([]);
  const [branches, setBranches] = useState([]);
  const [courseId, setCourseId] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

 const user = JSON.parse(sessionStorage.getItem('user'));
 console.log("user : "+user);
 
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user?.accessToken
  };

  const fetchCategories = async () => {
    try {
      const res = await fetchAllCategories(headers);
      const fetchedData = res.data;
      console.log(fetchedData);
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
      //   console.log(fetchedData);
      if (fetchedData) {
        const sortedData = fetchedData.sort((a, b) => a.universityName.localeCompare(b.universityName));
        const univeristyData = sortedData.map((c) => ({
          universityId: c.universityId,
          universityName: c.universityName
        }));
        setuniversities(univeristyData);
      }
    } catch (error) {
      console.error('Error fetching univeristies:', error);
    }
  };
  const fetchBranches = async () => {
    try {
      const res = await fetchAllBranches(headers);
      const fetchedData = res.data;
      console.log(fetchedData);
      if (fetchedData) {
        const sortedData = fetchedData.sort((a, b) => a.branchName.localeCompare(b.branchName));
        const univeristyData = sortedData.map((c) => ({
          branchId: c.branchId,
          branchName: c.branchName
        }));
        setBranches(univeristyData);
      }
    } catch (error) {
      console.error('Error fetching univeristies:', error);
    }
  };

  const FetchData = async () => {
    try {
      const res = await fetchCourses(headers);
      const fetchedData = res.data.content;
      // console.log(fetchedData);
      if (fetchedData) {
        const tableData = fetchedData.map((p) => ({
          courseId: p.courseId,
          courseName: p.courseName,
          description: p.description,
          // courseMrp: p.courseMrp,
          // discount: p.discount,
          // gst: p.gst,
          // gstAmount: p.gstAmount,
          // sellingPrice: p.sellingPrice,
          activePeriod: p.activePeriod,
          trailPeriod: p.trailPeriod,
          semester: p.semester,
          categoryName: p.courseCategoryDto ? p.courseCategoryDto.categoryName : 'No Category',
          universityName: p.universityDtoList ? p.universityDtoList.universityName : 'No university',
          // branchName: p.branchDtoList ? p.branchDtoList.branchName : 'No branch',
          videoUrl: p.videoUrl,
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy ? p.createdBy.userName : 'No User',
          updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
        }));
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
    // fetchBranches();
  }, [refreshTrigger]);

  const validateForm = () => {
  const newErrors = {};
  
  // Required fields
  if (!userdata.courseName?.trim()) newErrors.courseName = 'Course name is required';
  if (!userdata.description?.trim()) newErrors.description = 'Description is required';
  if (!userdata.videoUrl?.trim()) newErrors.videoUrl = 'Video URL is required';
  if (!userdata.categoryId) newErrors.categoryId = 'Category is required';
  if (!userdata.universityId) newErrors.universityId = 'University is required';
  
  // Format validations
  // if (userdata.videoUrl && !isValidUrl(userdata.videoUrl)) {
  //   newErrors.videoUrl = 'Enter a valid URL';
  // }
  
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
      universityId:'',
      // discount: '',
      // handlingFee: '',
      // sellingPrice: '',
      // subscriptionDays: '',
      trailPeriod: '',
      videoUrl: '',
      categoryId: ''
    });
    setOpen(true);
  };

// const postData = async (e) => {
//   e.preventDefault();

//   const validationErrors = validateForm();
//   if (Object.keys(validationErrors).length > 0) {
//     setErrors(validationErrors);
//     return;
//   }

//   const dataToPost = {
//     course_name: userdata.courseName,
//     description: userdata.description,
//     active_period: parseInt(userdata.activePeriod) || 0,
//     trail_period: parseInt(userdata.trailPeriod) || 0,
//     semester: parseInt(userdata.semester) || 0,
//     video_url: userdata.videoUrl,
//     course_category_dto: JSON.stringify({  // Stringify nested objects
//       category_id: parseInt(userdata.categoryId)
//     }),
//     university_dto: JSON.stringify({
//       university_id: parseInt(userdata.universityId)
//     }),
//     created_by: JSON.stringify({
//       user_id: user.userId,
//       user_name: user.userName,
//       full_name: user.fullName || 'N/A',
//       mobile_number: user.mobileNumber || 'N/A'
//     })
//   };

//   // Convert all values to strings if backend expects strings
//   const stringifiedPayload = Object.fromEntries(
//     Object.entries(dataToPost).map(([key, value]) => [key, String(value)])
//   );

//   console.log("Final payload:", stringifiedPayload);

//   try {
//     const response = await addCourse(stringifiedPayload, headers);
//     // ... rest of success handling
//   } catch (error) {
//     // Enhanced error handling
//     if (error.response) {
//       console.error('Server responded with:', error.response.data);
//       Swal.fire({
//         icon: 'error',
//         title: 'Server Error',
//         text: error.response.data.message || 
//              JSON.stringify(error.response.data),
//         confirmButtonColor: '#03045E'
//       });
//     } else {
//       console.error('Request failed:', error.message);
//       Swal.fire({
//         icon: 'error',
//         title: 'Network Error',
//         text: 'Cannot connect to server. Please try again later.',
//         confirmButtonColor: '#03045E'
//       });
//     }
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
  courseCategoryDto: {
    categoryId: parseInt(userdata.categoryId),
    categoryName: userdata.categoryName || ''
  },
  courseId: 0,
  courseName: userdata.courseName,
  description: userdata.description,
  videoUrl: userdata.videoUrl,
  noOfSem: parseInt(userdata.noOfSem) || 0,
  universityDtoList: {
    universityId: parseInt(userdata.universityId),
    universityName: userdata.universityName || ''
  },
  createdBy: {
    userId: user.userId,
    userName: user.userName,
    fullName: user.fullName || 'N/A',
    mobileNumber: user.mobileNumber || 'N/A'
  },
  updatedBy: {
    userId: user.userId,
    userName: user.userName,
    fullName: user.fullName || 'N/A',
    mobileNumber: user.mobileNumber || 'N/A'
  },
  insertedDate: new Date().toISOString(),
  updatedDate: new Date().toISOString(),

};

// const dataToPost = {
//   courseCategoryDto: {
//     categoryId: parseInt(userdata.categoryId),
//     categoryName: userdata.categoryName || ''
//   },
//   courseId: 0, // or set courseId if editing
//   courseName: userdata.courseName,
//   description: userdata.description,
//   videoUrl: userdata.videoUrl,
//   noOfSem: parseInt(userdata.noOfSem) || 0,
//   universityDtoList: {
//     universityId: parseInt(userdata.universityId),
//     universityName: userdata.universityName || ''
//   },
//   createdBy: {
//     userId: user.userId,
//     userName: user.userName,
//     fullName: user.fullName || 'N/A',
//     mobileNumber: user.mobileNumber || 'N/A'
//   },
//   updatedBy: {
//     userId: user.userId,
//     userName: user.userName,
//     fullName: user.fullName || 'N/A',
//     mobileNumber: user.mobileNumber || 'N/A'
//   },
//   insertedDate: new Date().toISOString(),
//   updatedDate: new Date().toISOString()
// };


  console.log("Final payload:", dataToPost);

  try {
    const response = await addCourse(dataToPost, headers);
    // Success handling here
    console.log(response.data);
  } catch (error) {
    if (error.response) {
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: error.response.data.message || JSON.stringify(error.response.data),
        confirmButtonColor: '#03045E'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Cannot connect to server. Please try again later.',
        confirmButtonColor: '#03045E'
      });
    }
  }
};


const updateData = async (e) => {
  e.preventDefault();

  
  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  const updateData = async (e) => {
  e.preventDefault();

  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  const updatedDataPayload = {
    course_id: courseId,  // Changed to snake_case
    course_name: userdata.courseName,  // Changed to snake_case
    description: userdata.description,
    active_period: parseInt(userdata.activePeriod) || 0,  // Changed to snake_case
    trail_period: parseInt(userdata.trailPeriod) || 0,    // Changed to snake_case
    semester: parseInt(userdata.semester) || 0,
    video_url: userdata.videoUrl,  // Changed to snake_case
    course_category_dto: {  // Changed to snake_case
      category_id: parseInt(userdata.categoryId)  // Changed to snake_case
    },
    university_dto: {  // Changed to snake_case
      university_id: parseInt(userdata.universityId)  // Changed to snake_case
    },
    updated_by: {  // Changed to snake_case
      user_id: user.userId,  // Changed to snake_case
      user_name: user.userName,  // Changed to snake_case
      full_name: user.fullName || '',  // Changed to snake_case
      mobile_number: user.mobileNumber || ''  // Changed to snake_case
    }
  };

  // ... rest of the function remains the same
};

  console.log("Update payload:", JSON.stringify(updatedDataPayload, null, 2));

  try {
    const response = await updatedCourse(updatedDataPayload, headers);
    if (response.data.responseCode === 201) {
      setRefreshTrigger(!refreshTrigger);
      setOpen(false);
      setEditMode(false);
      setCourseId(null);
      setUserData({
        ...userdata
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.data.errorMessage || 'Update failed',
        confirmButtonColor: '#03045E'
      });
    }
  } catch (error) {
    console.error('Update error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to update course',
      confirmButtonColor: '#03045E'
    });
  }
};
  const handleEdit = async (courseId) => {
    setEditMode(true);
    setOpen(true);
    try {
      const res = await fetchCourseById(courseId, headers);
      const det = res.data;
      // console.log(det);
      setCourseId(det.courseId);

      setUserData({
        courseName: det.courseName,
        description: det.description,
        // courseMrp: det.courseMrp,
        // discount: det.discount,
        // sellingPrice: det.sellingPrice,
        // gst: det.gst,
        // gstAmount: det.gstAmount,
        activePeriod: det.activePeriod,
        trailPeriod: det.trailPeriod,
        semester: det.semester,
        videoUrl: det.videoUrl,
        categoryId: det.courseCategoryDto ? det.courseCategoryDto.categoryId : '',
        universityId: det.universityDtoList ? det.universityDtoList.universityId : '',
        branchId: det.branchDtoList ? det.branchDtoList.branchId : ''
      });
    } catch (error) {
      console.error('Error fetching subject details:', error);
    }
  };



 const checkIfCourseInBatches = async (courseId) => {
  try {
    // You'll need to implement an API endpoint that checks if the course is used in any batches
    // This is just a placeholder - replace with your actual API call
    const response = await axios.get(`/api/batches/check-course/${courseId}`, { headers });
    return response.data.isInUse; // Assuming API returns { isInUse: true/false }
  } catch (error) {
    console.error('Error checking course usage:', error);
    return true; // Default to true to prevent deletion if check fails
  }
};

const handleDelete = async (courseId) => {
  try {
    // First check if course is in use
    const isCourseInUse = await checkIfCourseInBatches(courseId);
    if (isCourseInUse) {
      Swal.fire({
        icon: 'error',
        title: 'Cannot Delete',
        text: 'This course is assigned to batches and cannot be deleted.',
        confirmButtonColor: '#03045E'
      });
      return;
    }

    // Only proceed with delete confirmation if course is not in use
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
      console.log(response);
      // Check if the delete was successful
      if (response.status === 200 || response.status === 204) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The course has been deleted.',
          confirmButtonColor: '#03045E'
        });
        setRefreshTrigger(!refreshTrigger);
      } else {
        throw new Error(response.data?.message || 'Failed to delete course');
      }
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'An error occurred while processing your request.',
      confirmButtonColor: '#03045E'
    });
  }
};

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span> Courses</span>
          <Button
            variant="contained"
            color="primary"
            sx={{
              display: 'flex', alignItems: 'center', fontSize: '15px', backgroundColor: "#03045E",
              '&:hover': {
                backgroundColor: "#03045E",
                opacity: 0.9
              }
            }}
            onClick={handleAddCourses}
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
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, fontWeight: 600, fontSize: 15 }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.categoryId}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'actions' ? (
                        <>
                          <IconButton
                            sx={{ color: "#03045E" }}
                            onClick={() => {
                              handleEdit(row.courseId);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              handleDelete(row.courseId);
                            }}
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
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontSize: '16px' }}>
          {editMode ? 'Edit Courses' : 'Add Courses'}
          </DialogTitle>

        <Box component="form"  onSubmit={editMode ? updateData : postData} noValidate sx={{ p: 3 }}>
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

            {/* categoryId */}
            <Grid item xs={12}>
              <FormControl fullWidth sx={{
                mb: 2, '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#03045E',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#03045E',
                },
              }} >
                <InputLabel>Category</InputLabel>
                <Select
                  name="categoryId"
                  value={userdata.categoryId}
                  onChange={changeHandler}
                  error={!!errors.categoryId}
                  helperText={errors.categoryId}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* universityId */}
            <Grid item xs={12}>
              <FormControl fullWidth sx={{
                mb: 2, '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#03045E',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#03045E',
                },
              }}>
                <InputLabel>University</InputLabel>
                <Select
                  name="universityId"
                  value={userdata.universityId}
                  onChange={changeHandler}
                  error={!!errors.universityId}
                  helperText={errors.universityId}
                >
                  {universities.map((university) => (
                    <MenuItem key={university.universityId} value={university.universityId}>
                      {university.universityName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12}>
              <FormControl fullWidth sx={{
                mb: 2, '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#03045E',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#03045E',
                },
              }}>
                <InputLabel>Branch</InputLabel>
                <Select
                  name="branchId"
                  value={userdata.branchId}
                  onChange={changeHandler}
                  error={!!errors.branchId}
                  helperText={errors.branchId}
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch.branchId} value={branch.branchId}>
                      {branch.branchName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="MRP"
                name="courseMrp"
                value={userdata.courseMrp}
                onChange={changeHandler}
                error={!!errors.courseMrp}
                helperText={errors.courseMrp}
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
            </Grid> */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Discount"
                name="discount"
                value={userdata.discount}
                onChange={changeHandler}
                error={!!errors.discount}
                helperText={errors.discount}
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
            </Grid> */}

            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Selling Price"
                name="sellingPrice"
                value={userdata.sellingPrice}
                onChange={changeHandler}
                error={!!errors.sellingPrice}
                helperText={errors.sellingPrice}
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
            </Grid> */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GST"
                name="gst"
                value={userdata.gst}
                onChange={changeHandler}
                error={!!errors.gst}
                helperText={errors.gst} sx={{
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
            </Grid> */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GST Amount"
                name="gstAmount"
                value={userdata.gstAmount}
                onChange={changeHandler}
                error={!!errors.gstAmount}
                helperText={errors.gstAmount}
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
            </Grid> */}

            {/* activePeriod */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Active Period "
                name="activePeriod"
                value={userdata.activePeriod}
                onChange={changeHandler}
                error={!!errors.activePeriod}
                helperText={errors.activePeriod}
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

            {/* Trail Period */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Trail Period "
                name="trailPeriod"
                value={userdata.trailPeriod}
                onChange={changeHandler}
                error={!!errors.trailPeriod}
                helperText={errors.trailPeriod}
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

            {/* semester */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Semester "
                name="semester"
                value={userdata.semester}
                onChange={changeHandler}
                error={!!errors.semester}
                helperText={errors.semester}
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

            {/* VideoUrl */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="VideoUrl "
                name="videoUrl"
                value={userdata.videoUrl}
                onChange={changeHandler}
                error={!!errors.videoUrl}
                helperText={errors.videoUrl} sx={{
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

export default UpSkillCourses;