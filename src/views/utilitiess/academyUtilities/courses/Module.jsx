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
//   IconButton
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit } from '@mui/icons-material';
// import MainCard from 'ui-component/cards/MainCard';
// import { gridSpacing } from 'store/constant';
// import { useState, useEffect, useRef } from 'react';
// import moment from 'moment';
// import { useTheme } from '@mui/material/styles';
// import { addModule, deleteModule, fetchModuleById, fetchModules, updatedModule } from 'views/API/ModuleApi';
// import { fetchAllSubjects } from 'views/API/SubjectApi';
// import { BaseUrl } from 'BaseUrl';
// import axios from 'axios';
// import Swal from 'sweetalert2';

// const columns = [
//   { id: 'moduleId', label: 'ID' },
//   { id: 'moduleName', label: 'Name', minWidth: 100 },
//   { id: 'description', label: 'Description', minWidth: 400 },
//   { id: 'subjectName', label: 'Subject Name', minWidth: 150 },
//   { id: 'file', label: 'PDF File', minWidth: 200 },
//   { id: 'createdBy', label: 'Created By', align: 'right' },
//   { id: 'updatedBy', label: 'Updated By', align: 'right' },
//   { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
//   { id: 'updatedDate', label: 'Updated Date', align: 'right' },
//   { id: 'actions', label: 'Actions', align: 'right' }
// ];

// const Modules = () => {
//   const theme = useTheme();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [subjects, setSubjects] = useState([]);
//   const [modules, setModules] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [userdata, setUserData] = useState({
//     moduleName: '',
//     description: '',
//     subjectId: '',
//     fileName: '',
//     filePath: null
//   });
//   const [errors, setErrors] = useState({});
//   const [refreshTrigger, setRefreshTrigger] = useState(false);
//   const [moduleId, setModuleId] = useState(null);
//   const inputRef = useRef(null);

//   const user = JSON.parse(sessionStorage.getItem('user'));
//   const headers = {
//     'Content-type': 'application/json',
//     Authorization: 'Bearer ' + user.accessToken
//   };

//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const fetchData = async () => {
//     try {
//       const res = await fetchModules(headers);
//       const fetchedData = res.data.content || [];
//       const tableData = fetchedData
//         .map((p) => ({
//           moduleId: p.moduleId,
//           moduleName: p.moduleName,
//           description: (
//             <div style={{ textAlign: 'justify', textJustify: 'inter-word', whiteSpace: 'pre-line' }}>
//               {p.description}
//             </div>
//           ),
//           subjectName: p.subjectDtoList?.[0]?.subjectName || 'No subject',
//           file: p.filePath
//             ? (
//               <a
//                 href={`${BaseUrl}/file/downloadFile/?filePath=${p.filePath}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 {p.fileName || 'Download PDF'}
//               </a>
//             )
//             : 'NO FILE FOUND',
//           insertedDate: moment(p.insertedDate).format('L'),
//           updatedDate: moment(p.updatedDate).format('L'),
//           createdBy: p.createdBy ? p.createdBy.userName : 'No User',
//           updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
//         }))
//         .sort((a, b) => a.moduleId - b.moduleId);
//       setModules(tableData);
//     } catch (error) {
//       console.error('Error fetching modules:', error);
//     }
//   };

//   const fetchSubjects = async () => {
//     try {
//       const res = await fetchAllSubjects(headers);
//       const fetchedData = res.data;
//       if (fetchedData) {
//         const sortedData = fetchedData.sort((a, b) => a.subjectName.localeCompare(b.subjectName));
//         setSubjects(sortedData.map((s) => ({ subjectId: s.subjectId, subjectName: s.subjectName })));
//       }
//     } catch (error) {
//       console.error('Error fetching subjects:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchSubjects();
//   }, [refreshTrigger]);

//   const validateForm = () => {
//     const newErrors = {};
//     if (!userdata.moduleName.trim()) newErrors.moduleName = 'Enter the module name';
//     if (!userdata.description.trim()) newErrors.description = 'Enter the description';
//     if (!userdata.subjectId) newErrors.subjectId = 'Select a subject';
//     return newErrors;
//   };

//   const changeHandler = (e) => {
//     setUserData({ ...userdata, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: null });
//   };

//   const handleAddModule = () => {
//     setEditMode(false);
//     setUserData({ moduleName: '', description: '', subjectId: '', fileName: '', filePath: null });
//     setSelectedFile(null);
//     setOpen(true);
//   };

//   const onFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   const onFileUpload = async () => {
//     if (!selectedFile) {
//       Swal.fire({
//         icon: 'error',
//         title: 'No file selected',
//         text: 'Please select a file',
//         confirmButtonColor: theme.palette.primary.main
//       });
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     try {
//       Swal.fire({
//         title: 'Uploading...',
//         allowOutsideClick: false,
//         didOpen: () => Swal.showLoading()
//       });

//       const res = await axios.post(`${BaseUrl}/file/uploadFile`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: 'Bearer ' + user.accessToken
//         }
//       });

//       Swal.close();

//       if (res.status === 200) {
//         setUserData((prev) => ({
//           ...prev,
//           fileName: res.data.fileName,
//           filePath: res.data.filePath || res.data.fileDownloadUri || null
//         }));
//         Swal.fire({
//           icon: 'success',
//           title: 'File uploaded successfully',
//           showConfirmButton: false,
//           timer: 1500
//         });
//       }
//     } catch (err) {
//       Swal.close();
//       Swal.fire({
//         icon: 'error',
//         title: 'Upload failed',
//         text: 'Please try again',
//         confirmButtonColor: theme.palette.primary.main
//       });
//       console.error(err);
//     }
//   };

//   const postData = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);

//     const dataToPost = {
//       moduleName: userdata.moduleName,
//       description: userdata.description,
//       subjectDtoList: [{ subjectId: userdata.subjectId }],
//       fileName: userdata.fileName,
//       filePath: userdata.filePath,
//       createdBy: { userId: user.userId }
//     };

//     try {
//       await addModule(dataToPost, headers);
//       setRefreshTrigger(!refreshTrigger);
//       setOpen(false);
//     } catch (error) {
//       console.error('Error in postData:', error);
//     }
//   };

//   const updateData = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);

//     const updatedDataPayload = {
//       moduleId,
//       moduleName: userdata.moduleName,
//       description: userdata.description,
//       subjectDtoList: [{ subjectId: userdata.subjectId }],
//       fileName: userdata.fileName,
//       filePath: userdata.filePath,
//       updatedBy: { userId: user.userId }
//     };

//     try {
//       const response = await updatedModule(updatedDataPayload, headers);
//       if ([200, 201].includes(response.data.responseCode)) {
//         setRefreshTrigger(!refreshTrigger);
//         setOpen(false);
//         setEditMode(false);
//         setModuleId(null);
//         Swal.fire({
//           icon: 'success',
//           title: 'Success',
//           text: 'Module updated successfully',
//           showConfirmButton: false,
//           timer: 1500
//         });
//       }
//     } catch (error) {
//       console.error('Error updating module:', error);
//     }
//   };

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
//         subjectId: det.subjectDtoList?.[0]?.subjectId || '',
//         fileName: det.fileName || '',
//         filePath: det.filePath || det.fileDownloadUri || null
//       });
//     } catch (error) {
//       console.error('Error fetching module details:', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const result = await Swal.fire({
//         title: 'Are you sure?',
//         text: "You won't be able to revert this!",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#03045E',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, delete it!'
//       });

//       if (result.isConfirmed) {
//         await deleteModule(id, headers);
//         setRefreshTrigger(!refreshTrigger);
//         Swal.fire({
//           icon: 'success',
//           title: 'Deleted!',
//           text: 'Module has been deleted.',
//           showConfirmButton: false,
//           timer: 1500
//         });
//       }
//     } catch (error) {
//       console.error('Error deleting module:', error);
//     }
//   };

//   return (
//     <MainCard
//       title={
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <span>Modules</span>
//           <Button
//             variant="contained"
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               fontSize: '15px',
//               backgroundColor: '#03045E',
//               '&:hover': { opacity: 0.9 }
//             }}
//             onClick={handleAddModule}
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
//                           <IconButton sx={{ color: '#03045E' }} onClick={() => handleEdit(row.moduleId)}>
//                             <Edit />
//                           </IconButton>
//                           <IconButton color="error" onClick={() => handleDelete(row.moduleId)}>
//                             <DeleteForever />
//                           </IconButton>
//                         </>
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

//       {/* Dialog for Add/Edit */}
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle>{editMode ? 'Edit Module' : 'Add Module'}</DialogTitle>
//         <Box component="form" onSubmit={editMode ? updateData : postData} sx={{ p: 3 }}>
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
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth error={!!errors.subjectId}>
//                 <InputLabel>Subject *</InputLabel>
//                 <Select
//                   name="subjectId"
//                   value={userdata.subjectId || ''}
//                   onChange={(e) => setUserData({ ...userdata, subjectId: e.target.value })}
//                 >
//                   {subjects.map((subject) => (
//                     <MenuItem key={subject.subjectId} value={subject.subjectId}>
//                       {subject.subjectName}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {errors.subjectId && <Box sx={{ color: 'red', fontSize: '0.75rem', mt: 1 }}>{errors.subjectId}</Box>}
//               </FormControl>
//             </Grid>

           
//             {/* PDF Upload */}
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="PDF File"
//                 value={userdata.fileName}
//                 disabled
//                 InputProps={{
//                   endAdornment: (
//                     <Button
//                       variant="contained"
//                       onClick={onFileUpload}
//                       disabled={!selectedFile}
//                     >
//                       Upload
//                     </Button>
//                   )
//                 }}
//               />
//               <input
//                 type="file"
//                 ref={inputRef}
//                 style={{ display: 'none' }}
//                 accept="application/pdf"
//                 onChange={e => onFileChange(e, 'pdf')}
//               />
//               <Button
//                 variant="outlined"
//                 onClick={() => inputRef.current.click()}
//                 sx={{ mt: 1 }}
//               >
//                 Select File
//               </Button>
             
//             </Grid>

//           </Grid>

//           <DialogActions sx={{ mt: 2 }}>
//             <Button onClick={() => setOpen(false)}>Cancel</Button>
//             <Button type="submit" variant="contained">
//               {editMode ? 'Update' : 'Save'}
//             </Button>
//           </DialogActions>
//         </Box>
//       </Dialog>
//     </MainCard>
//   );
// };

// export default Modules;
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TablePagination
} from '@mui/material';

const CategoryCards = ({ categories, page, rowsPerPage, onEdit, onDelete, onPageChange, onRowsPerPageChange }) => {
  const count = categories.length;

  return (
    <>
      <Grid container spacing={2}>
        {categories
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((cat) => (
            <Grid item xs={12} sm={6} md={4} key={cat.categoryId}>
              <Card
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h4"
                    align="center"
                    sx={{ fontWeight: 'bold', mb: 1 }}
                  >
                    {cat.categoryName}
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary">
                    {cat.description}
                  </Typography>
                  
                  <Grid container spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                    <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(cat.categoryId)}>
                        ViewMore
                      </Button>
                    </Grid>

                    <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(cat.categoryId)}>
                        Edit
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(cat.categoryId)}
                      >
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  );
};

export default CategoryCards;
