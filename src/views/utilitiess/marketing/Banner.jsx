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
// import { fetchBanner, addBanner, deleteBanner, getAdvertiseById, updatedAdvertise } from 'views/API/BannerApi';
// import { BaseUrl } from 'BaseUrl';
// import { useState, useEffect, useRef } from 'react';
// import moment from 'moment';
// import { Box, Button, Dialog, DialogActions, DialogTitle, TextField, Container, IconButton } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import axios from 'axios';
// import { DeleteForever, Edit } from '@mui/icons-material';
// import Swal from 'sweetalert2';

// const columns = [
//   { id: 'advertisementId', label: 'ID', align: 'center' },
//   { id: 'advertisementName', label: 'Name', align: 'center' },
//   { id: 'description', label: 'Description', minWidth: 100 },
//   { id: 'file', label: 'File', align: 'center' },
//   { id: 'createdBy', label: 'Created By', align: 'center' },
//   { id: 'updatedBy', label: 'Updated By', align: 'center' },
//   { id: 'insertedDate', label: 'Inserted Date', align: 'center' },
//   { id: 'updatedDate', label: 'Updated Date', align: 'center' },
//   { id: 'actions', label: 'Actions', align: 'center' }
// ];

// const Banner = () => {
//   const theme = useTheme();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [advertisement, setAdvertisement] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [userdata, setUserData] = useState({
//     advertisementName: '',
//     description: '',
//     fileName: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [fileError, setFileError] = useState('');
//   const [fileName, setFileName] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [refreshTrigger, setRefreshTrigger] = useState(false);
//   const [advertisementId, setAdvertisementId] = useState(null);

//       const [isUploading, setIsUploading] = useState(false);
    
  
//   const inputRef = useRef(null);

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
//     Authorization: 'Bearer ' + user.accessToken
//   };

//   const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

//   const FetchData = async () => {
//     try {
//       const res = await fetchBanner(headers);
//       const fetchedData = res.data.content;
//       console.log(fetchedData)

//       if (fetchedData) {
//         const tableData = fetchedData.map((p) => ({
//           advertisementId: p.advertisementId,
//           advertisementName: p.advertisementName ? p.advertisementName : 'Not Found',
//           description: p.description ? p.description : 'Not Found',
//           file:
//             p.filePath === null ? (
//               'NO IMAGE FOUND'
//             ) : (
//               <img src={ImageUrl + p.filePath} alt={p.fileName} style={{ width: 100, height: 50 }} />
//             ),
//           insertedDate: moment(p.insertedDate).format('L'),
//           updatedDate: moment(p.updatedDate).format('L'),
//           createdBy: p.createdBy ? p.createdBy.userName : 'No User',
//           updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
//         }));
//         setAdvertisement(tableData);
//       } else {
//         setAdvertisement([]);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     FetchData();
//   }, [refreshTrigger]);

//   const postData = async (e) => {
//     e.preventDefault();
//     const formErrors = validateForm();

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//     } else {
//       try {
//         if (editMode) {
//           const updatedData = {
//             ...userdata,
//             advertisementId,
//             updatedBy: { userId: user.userId }
//           };
//           await updatedAdvertise(updatedData, headers);
//         } else {
//           await addBanner(userdata, headers);
//         }
//         setUserData({ advertisementName: '', description: '', fileName: '' });
//         inputRef.current.value = null;
//         setRefreshTrigger((prev) => !prev);
//         setOpen(false);
//       } catch (error) {
//         console.error('Error saving advertisement:', error);
//       }
//     }
//   };

//    const fileUploadHeaders = {
//     'Content-Type': 'multipart/form-data',
//     Authorization: 'Bearer ' + user.accessToken
//   };
//    const onFileChange = (e) => {
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
//   // const onFileUpload = async (e) => {
//   //   e.preventDefault();
//   //   if (!selectedFile) {
//   //     setFileError('Please select a file');
//   //     return;
//   //   }

//   //   const data = new FormData();
//   //   data.append('file', selectedFile);

//   //   try {
//   //     const res = await axios.post(`${BaseUrl}/file/uploadFile`, data, {
//   //       headers: {
//   //         'content-type': 'multipart/form-data',
//   //         Authorization: 'Bearer ' + user.accessToken
//   //       }
//   //     });

//   //     setFileName(res.data.fileName);
//   //     setUserData({ ...userdata, fileName: res.data.fileName });
//   //     setFileError('');


//   //     Swal.fire({
//   //       target: document.getElementById("your-dialog-id"),
//   //       icon: 'success',
//   //       title: 'Upload Successful',
//   //       text: res.data.message || 'Your file has been uploaded successfully.',
//   //       timer: 2500,
//   //       showConfirmButton: false
//   //     });
//   //   } catch (err) {
//   //     console.error('Error uploading file:', err);

//   //     Swal.fire({
//   //       icon: 'error',
//   //       title: 'Upload Failed',
//   //       text: err?.response?.data?.errorMessage || 'Something went wrong during file upload.',
//   //       confirmButtonColor: '#d33'
//   //     });
//   //   }
//   // };


//   // const onFileChange = (e) => {
//   //   setFileName(e.target.files[0].name);
//   //   setSelectedFile(e.target.files[0]);
//   // };

  
//   // const onFileChange = (e) => {
//   //   const selectedFile = e.target.files[0];
//   //   setSelectedFile(selectedFile);
//   //   setFileName(selectedFile ? selectedFile.name : '');
//   // };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!userdata.advertisementName || userdata.advertisementName.trim() === '') {
//       newErrors.advertisementName = 'Enter the Advertisement name';
//     }

//     if (!userdata.description || userdata.description.trim() === '') {
//       newErrors.description = 'Enter the description';
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

//   const handleAddBanner = () => {
//     setEditMode(false);
//     setUserData({
//       advertisementName: '',
//       description: '',
//       fileName: ''
//     });
//     setOpen(true);
//   };

//   const handleEdit = async (advertisementId) => {
//     setEditMode(true);
//     setOpen(true);
//     try {
//       const res = await getAdvertiseById(advertisementId, headers);
//       const det = res.data;

//       setAdvertisementId(det.advertisementId);
//       setUserData({
//         advertisementName: det.advertisementName,
//         description: det.description,
//         fileName: det.fileName
//       });
//     } catch (error) {
//       console.error('Error fetching advertisement details:', error);
//     }
//   };

//   const handleDelete = async (advertisementId) => {
//     try {
//       await deleteBanner(advertisementId, headers);
//       FetchData();
//     } catch (error) {
//       console.error('Error deleting advertisement:', error);
//     }
//   };

//   return (
//     <MainCard
//       title={
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <span>Banner</span>
//           <Button
//             variant="contained"
//             sx={{
//               display: 'flex', alignItems: 'center', fontSize: '15px', backgroundColor: "#03045E",
//               '&:hover': {
//                 backgroundColor: "#03045E",
//                 opacity: 0.9
//               }
//             }}
//             onClick={handleAddBanner}
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
//               {advertisement.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
//                 <TableRow hover role="checkbox" tabIndex={-1} key={row.advertisementId}>
//                   {columns.map((column) => (
//                     <TableCell key={column.id} align={column.align}>
//                       {column.id === 'actions' ? (
//                         <>
//                           <IconButton onClick={() => handleEdit(row.advertisementId)} sx={{ color: "#03045E" }}>
//                             <Edit />
//                           </IconButton>
//                           <IconButton onClick={() => handleDelete(row.advertisementId)} color="error">
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
//           count={advertisement.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" id="your-dialog-id">
//         <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Advertisement' : 'Add Advertisement'}</DialogTitle>
//         <Box component="form" onSubmit={postData} noValidate sx={{ p: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Advertisement Name"
//                 name="advertisementName"
//                 value={userdata.advertisementName}
//                 onChange={changeHandler}
//                 error={!!errors.advertisementName}
//                 helperText={errors.advertisementName}
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
//                 id="fileName"
//                 label="File Name"
//                 name="fileName"
//                 autoComplete="fileName"
//                 value={userdata.fileName}
//                 disabled
//                 helperText={errors.fileName}
//                 error={!!errors.fileName}
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

// export default Banner;


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
import { fetchBanner, addBanner, deleteBanner, getAdvertiseById, updatedAdvertise } from 'views/API/BannerApi';
import { BaseUrl } from 'BaseUrl';
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Box, Button, Dialog, DialogActions, DialogTitle, TextField, Container, IconButton, ToggleButtonGroup, ToggleButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
import Swal from 'sweetalert2';

// ✅ Import BannerCards component (you'll need to create this)
import BannerCards from './BannerCards';

const columns = [
  { id: 'advertisementId', label: 'ID', align: 'center' },
  { id: 'advertisementName', label: 'Name', align: 'center' },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'file', label: 'File', align: 'center' },
  { id: 'createdBy', label: 'Created By', align: 'center' },
  { id: 'updatedBy', label: 'Updated By', align: 'center' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'center' },
  { id: 'updatedDate', label: 'Updated Date', align: 'center' },
  { id: 'actions', label: 'Actions', align: 'center' }
];

const Banner = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [advertisement, setAdvertisement] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // ✅ Added view mode state
  const [userdata, setUserData] = useState({
    advertisementName: '',
    description: '',
    fileName: ''
  });
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [advertisementId, setAdvertisementId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);

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
    Authorization: 'Bearer ' + user.accessToken
  };

  const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

  // const FetchData = async () => {
  //   try {
  //     const res = await fetchBanner(headers);
  //     const fetchedData = res.data.content;
  //     console.log(fetchedData)

  //     if (fetchedData) {
  //       const tableData = fetchedData.map((p) => ({
  //         advertisementId: p.advertisementId,
  //         advertisementName: p.advertisementName ? p.advertisementName : 'Not Found',
  //         description: p.description ? p.description : 'Not Found',
  //         filePath: p.filePath, // ✅ Keep filePath for card view
  //         file:
  //           p.filePath === null ? (
  //             'NO IMAGE FOUND'
  //           ) : (
  //             <img src={ImageUrl + p.filePath} alt={p.fileName} style={{ width: 100, height: 50 }} />
  //           ),
  //         insertedDate: moment(p.insertedDate).format('L'),
  //         updatedDate: moment(p.updatedDate).format('L'),
  //         createdBy: p.createdBy ? p.createdBy.userName : 'No User',
  //         updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
  //       }));
  //       setAdvertisement(tableData);
  //     } else {
  //       setAdvertisement([]);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };


  const FetchData = async () => {
  try {
    const res = await fetchBanner(headers);
    const fetchedData = res.data.content;
    console.log(fetchedData);

    if (fetchedData) {
      // ✅ Sort by insertedDate (ascending)
      const sortedData = [...fetchedData].sort(
        (a, b) => new Date(a.insertedDate) - new Date(b.insertedDate)
      );

      const tableData = sortedData.map((p, index) => ({
        advertisementId: index + 1, // ✅ Generate serial number instead of DB id
        originalId: p.advertisementId, // ✅ Keep actual DB id for edit/delete
        advertisementName: p.advertisementName ? p.advertisementName : 'Not Found',
        description: p.description ? p.description : 'Not Found',
        filePath: p.filePath,
        file:
          p.filePath === null ? (
            'NO IMAGE FOUND'
          ) : (
            <img src={ImageUrl + p.filePath} alt={p.fileName} style={{ width: 100, height: 50 }} />
          ),
        insertedDate: moment(p.insertedDate).format('L'),
        updatedDate: moment(p.updatedDate).format('L'),
        createdBy: p.createdBy ? p.createdBy.userName : 'No User',
        updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
      }));
      setAdvertisement(tableData);
    } else {
      setAdvertisement([]);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

  useEffect(() => {
    FetchData();
  }, [refreshTrigger]);

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
            advertisementId,
            updatedBy: { userId: user.userId }
          };
          await updatedAdvertise(updatedData, headers);
        } else {
          await addBanner(userdata, headers);
        }
        setUserData({ advertisementName: '', description: '', fileName: '' });
        inputRef.current.value = null;
        setRefreshTrigger((prev) => !prev);
        setOpen(false);
      } catch (error) {
        console.error('Error saving advertisement:', error);
      }
    }
  };

  const fileUploadHeaders = {
    'Content-Type': 'multipart/form-data',
    Authorization: 'Bearer ' + user.accessToken
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
        headers: fileUploadHeaders
      });

      Swal.close();

      if (res.status === 200) {
        setUserData(prev => ({
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
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.advertisementName || userdata.advertisementName.trim() === '') {
      newErrors.advertisementName = 'Enter the Advertisement name';
    }

    if (!userdata.description || userdata.description.trim() === '') {
      newErrors.description = 'Enter the description';
    }

    if (!userdata.fileName || userdata.fileName.trim() === '') {
      newErrors.fileName = 'Select the file';
    }

    return newErrors;
  };

  const changeHandler = (e) => {
    setUserData({
      ...userdata,
      [e.target.name]: e.target.value,
      createdBy: { userId: user.userId }
    });

    setErrors({
      ...errors,
      [e.target.name]: null
    });
  };

  const handleAddBanner = () => {
    setEditMode(false);
    setUserData({
      advertisementName: '',
      description: '',
      fileName: ''
    });
    setOpen(true);
  };

  const handleEdit = async (advertisementId) => {
    setEditMode(true);
    setOpen(true);
    try {
      const res = await getAdvertiseById(advertisementId, headers);
      const det = res.data;

      setAdvertisementId(det.advertisementId);
      setUserData({
        advertisementName: det.advertisementName,
        description: det.description,
        fileName: det.fileName
      });
    } catch (error) {
      console.error('Error fetching advertisement details:', error);
    }
  };

  const handleDelete = async (advertisementId) => {
    try {
      await deleteBanner(advertisementId, headers);
      FetchData();
    } catch (error) {
      console.error('Error deleting advertisement:', error);
    }
  };

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Banner</span>
          <Box display="flex" alignItems="center" gap={1}>
            {/* ✅ Added Toggle Button Group */}
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
              onClick={handleAddBanner}
            >
              Add
              <AddIcon sx={{ color: '#fff' }} />
            </Button>
          </Box>
        </Box>
      }
    >
      <Grid container spacing={gridSpacing}></Grid>
      
      {/* ✅ Conditional rendering based on viewMode */}
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
                {advertisement.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.advertisementId}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'actions' ? (
                          <>
                            {/* <IconButton onClick={() => handleEdit(row.advertisementId)} sx={{ color: "#03045E" }}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(row.advertisementId)} color="error">
                              <DeleteForever />
                            </IconButton> */}
                            <IconButton onClick={() => handleEdit(row.originalId)} sx={{ color: "#03045E" }}>
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
            count={advertisement.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        // ✅ Use BannerCards component for card view
        <BannerCards
          advertisement={advertisement}
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
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Advertisement' : 'Add Advertisement'}</DialogTitle>
        <Box component="form" onSubmit={postData} noValidate sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Advertisement Name"
                name="advertisementName"
                value={userdata.advertisementName}
                onChange={changeHandler}
                error={!!errors.advertisementName}
                helperText={errors.advertisementName}
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
                id="fileName"
                label="File Name"
                name="fileName"
                autoComplete="fileName"
                value={userdata.fileName}
                disabled
                helperText={errors.fileName}
                error={!!errors.fileName}
                InputProps={{
                  endAdornment: (
                    <Button variant="contained" sx={{
                      backgroundColor: "#03045E",
                      '&:hover': {
                        backgroundColor: "#03045E",
                        opacity: 0.9
                      }
                    }} onClick={onFileUpload}>
                      Upload
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

export default Banner;