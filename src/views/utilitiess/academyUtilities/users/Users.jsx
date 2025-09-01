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
//   FormHelperText,
//   IconButton
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit } from '@mui/icons-material';
// import MainCard from 'ui-component/cards/MainCard';
// import { gridSpacing } from 'store/constant';
// import { useState, useEffect } from 'react';
// import moment from 'moment';
// import { useTheme } from '@mui/material/styles';
// import { addUsers, deleteUsers, fetchUsers, getUsersById, updatedUsers } from 'views/API/UsersApi';
// import { fetchAllRoles } from 'views/API/RoleApi';

// const columns = [
//   { id: 'userId', label: 'ID', align: 'center' },
//   { id: 'userName', label: 'Name', align: 'center' },
//   { id: 'email', label: 'Email', align: 'center' },
//   { id: 'mobileNumber', label: 'Mobile Number', align: 'center' },
//   // { id: 'password', label: 'Password', minWidth: 100,align: 'center' },
//   { id: 'roleName', label: 'Role', minWidth: 150, align: 'center' },
//   { id: 'createdBy', label: 'Created By', align: 'center' },
//   { id: 'updatedBy', label: 'Updated By', align: 'center' },
//   { id: 'insertedDate', label: 'Inserted Date', align: 'center' },
//   { id: 'updatedDate', label: 'Updated Date', align: 'center' },
//   { id: 'actions', label: 'Actions', align: 'center' }
// ];

// const Users = () => {
//   const theme = useTheme();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [roles, setRoles] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [userdata, setUserData] = useState({
//     userName: '',
//     fullName: '',
//     email: '',
//     mobileNumber: '',
//     password: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [refreshTrigger, setRefreshTrigger] = useState(false);
//   const [userId, setUserId] = useState(null);

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

//   const fetchData = async () => {
//     try {
//       const res = await fetchUsers(headers);
//       const fetchedData = res.data.content;
//       if (fetchedData) {
//         const tableData = fetchedData.map((p) => ({
//           userId: p.userId,
//           userName: p.userName,
//           fullName: p.fullName,
//           email: p.email,
//           mobileNumber: p.mobileNumber,
//           password: p.password,
//           roleName: p.roleDto ? p.roleDto.roleName : 'No Role Name',
//           insertedDate: moment(p.insertedDate).format('L'),
//           updatedDate: moment(p.updatedDate).format('L'),
//           createdBy: p.createdBy ? p.createdBy.userName : 'No User',
//           updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
//         }));
//         setUsers(tableData);
//       } else {
//         setUsers([]);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const res = await fetchAllRoles(headers);
//       const fetchedData = res.data;
//       if (fetchedData) {
//         const sortedData = fetchedData.sort((a, b) => a.roleName.localeCompare(b.roleName));
//         const roleData = sortedData.map((c) => ({
//           roleId: c.roleId,
//           roleName: c.roleName
//         }));
//         setRoles(roleData);
//       }
//     } catch (error) {
//       console.error('Error fetching roles:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchRoles();
//   }, [refreshTrigger]);

//   const validateForm = () => {
//     const newErrors = {};

//     if (!userdata.userName || userdata.userName.trim() === '') {
//       newErrors.userName = 'Enter the user name';
//     }
//     if (!userdata.fullName || userdata.fullName.trim() === '') {
//       newErrors.fullName = 'Enter the full name';
//     }
//     if (!userdata.email || userdata.email.trim() === '') {
//       newErrors.email = 'Enter the email Id';
//     } else {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(userdata.email)) {
//         newErrors.email = 'Enter a valid email address';
//       }
//     }
//     if (!userdata.mobileNumber || userdata.mobileNumber.trim() === '') {
//       newErrors.mobileNumber = 'Enter the mobile number';
//     } else {
//       const mobileRegex = /^[0-9]{10,15}$/;
//       if (!mobileRegex.test(userdata.mobileNumber)) {
//         newErrors.mobileNumber = 'Enter a valid mobile number';
//       }
//     }
//     if (!userdata.password || userdata.password.trim() === '') {
//       newErrors.password = 'Enter the password';
//     } else if (userdata.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     if (!userdata.roleId) {
//       newErrors.roleId = 'Select a role';
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

//   // Open Add User Dialog
//   const handleAddUser = () => {
//     setEditMode(false);
//     setUserData({
//       userName: '',
//       fullName: '',
//       email: '',
//       mobileNumber: '',
//       password: ''
//     });
//     setErrors({});
//     setOpen(true);
//   };

//   const postData = async (e) => {
//     e.preventDefault();

//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     const dataToPost = {
//       userName: userdata.userName,
//       fullName: userdata.fullName,
//       email: userdata.email,
//       mobileNumber: userdata.mobileNumber,
//       password: userdata.password,
//       roleDto: { roleId: userdata.roleId },
//       createdBy: { userId: user.userId }
//     };

//     console.log(dataToPost);

//     try {
//       const response = await addUsers(dataToPost, headers);
//       if (response.data.responseCode === 201) {
//         setRefreshTrigger(!refreshTrigger);
//         setOpen(false);
//         fetchData();
//       } else {
//         alert(response.data.errorMessage || 'Failed to add user.');
//       }
//     } catch (error) { }
//   };

//   const handleEdit = async (userId) => {
//     setEditMode(true);
//     setOpen(true);
//     try {
//       const res = await getUsersById(userId, headers);
//       const det = res.data;
//       console.log(det);

//       setUserId(det.userId);

//       setUserData({
//         userName: det.userName,
//         fullName: det.fullName,
//         email: det.email,
//         mobileNumber: det.mobileNumber,
//         password: det.password,
//         roleId: det.roleDto ? det.roleDto.roleId : ''
//       });
//       setErrors({});
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//     }
//   };

//   const updateData = async () => {
//     try {
//       const updatedData = {
//         ...userdata,
//         userId,
//         updatedBy: { userId: user.userId }
//       };
//       const resp = await updatedUsers(updatedData, headers);
//       console.log('User updated:', resp);
//       setRefreshTrigger((prev) => !prev);
//       setOpen(false);
//     } catch (error) {
//       console.error('Error updating user:', error);
//     }
//   };

//   const handleDelete = async (userId) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       try {
//         await deleteUsers(userId, headers);
//         setRefreshTrigger((prev) => !prev);
//       } catch (error) {
//         console.error('Error deleting user:', error);
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formErrors = validateForm();

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     if (editMode) {
//       await updateData();
//     } else {
//       await postData(e);
//     }
//   };

//   return (
//     <MainCard
//       title={
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <span>Users</span>
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
//             onClick={handleAddUser}
//           >
//             Add
//             <AddIcon sx={{ color: '#fff', ml: 1 }} />
//           </Button>
//         </Box>
//       }
//     >
//       <Grid container spacing={gridSpacing}></Grid>
//       <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
//         <TableContainer sx={{ maxHeight: 440 }}>
//           <Table stickyHeader aria-label="sticky table">
//             <TableHead>
//               <TableRow>
//                 {columns.map((column) => (
//                   <TableCell
//                     key={column.id}
//                     align={column.align ? column.align : 'left'}
//                     style={{ minWidth: column.minWidth, fontWeight: 600, fontSize: 15 }}
//                   >
//                     {column.label}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
//                 <TableRow hover role="checkbox" tabIndex={-1} key={row.userId}>
//                   {columns.map((column) => {
//                     const value = row[column.id];
//                     return (
//                       <TableCell key={column.id} align={column.align ? column.align : 'left'}>
//                         {column.id === 'actions' ? (
//                           <>
//                             <IconButton sx={{color:"#03045E"}} onClick={() => handleEdit(row.userId)}>
//                               <Edit />
//                             </IconButton>
//                             <IconButton color="error" onClick={() => handleDelete(row.userId)}>
//                               <DeleteForever />
//                             </IconButton>
//                           </>
//                         ) : (
//                           value || 'No Data'
//                         )}
//                       </TableCell>
//                     );
//                   })}
//                 </TableRow>
//               ))}
//               {users.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={columns.length} align="center">
//                     No users found.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[10, 25, 100]}
//           component="div"
//           count={users.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit User' : 'Add User'}</DialogTitle>
//         <Box component="form" noValidate sx={{ p: 3 }} onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="User Name"
//                 name="userName"
//                 value={userdata.userName}
//                 onChange={changeHandler}
//                 error={!!errors.userName}
//                 helperText={errors.userName}
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
//                 label="Email"
//                 name="email"
//                 value={userdata.email}
//                 onChange={changeHandler}
//                 error={!!errors.email}
//                 helperText={errors.email}
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
//                 label="Password"
//                 name="password"
//                 type="password"
//                 value={userdata.password}
//                 onChange={changeHandler}
//                 error={!!errors.password}
//                 helperText={errors.password}
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
//               <FormControl fullWidth error={!!errors.roleId} sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '&.Mui-focused fieldset': {
//                     borderColor: '#03045E',
//                   },
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': {
//                   color: '#03045E',
//                 },
//               }}>
//                 <InputLabel>Role</InputLabel>
//                 <Select name="roleId" value={userdata.roleId} onChange={changeHandler} label="Role">
//                   {roles.map((role) => (
//                     <MenuItem key={role.roleId} value={role.roleId}>
//                       {role.roleName}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {errors.roleId && <FormHelperText>{errors.roleId}</FormHelperText>}
//               </FormControl>
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

// export default Users;


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
//   FormHelperText,
//   IconButton,
//   ToggleButtonGroup,
//   ToggleButton
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
// import MainCard from 'ui-component/cards/MainCard';
// import { gridSpacing } from 'store/constant';
// import { useState, useEffect } from 'react';
// import moment from 'moment';
// import { useTheme } from '@mui/material/styles';
// import { addUsers, deleteUsers, fetchUsers, getUsersById, updatedUsers } from 'views/API/UsersApi';
// import { fetchAllRoles } from 'views/API/RoleApi';

// // ✅ Import UserCards component (you'll need to create this)
// import UsersCards from './UsersCards';

// const columns = [
//   { id: 'userId', label: 'ID', align: 'center' },
//   { id: 'userName', label: 'Name', align: 'center' },
//   { id: 'email', label: 'Email', align: 'center' },
//   { id: 'mobileNumber', label: 'Mobile Number', align: 'center' },
//   { id: 'roleName', label: 'Role', minWidth: 150, align: 'center' },
//   { id: 'createdBy', label: 'Created By', align: 'center' },
//   { id: 'updatedBy', label: 'Updated By', align: 'center' },
//   { id: 'insertedDate', label: 'Inserted Date', align: 'center' },
//   { id: 'updatedDate', label: 'Updated Date', align: 'center' },
//   { id: 'actions', label: 'Actions', align: 'center' }
// ];

// const Users = () => {
//   const theme = useTheme();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [roles, setRoles] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [viewMode, setViewMode] = useState('list'); // ✅ Added view mode state
//   const [userdata, setUserData] = useState({
//     userName: '',
//     fullName: '',
//     email: '',
//     mobileNumber: '',
//     password: '',
//     roleId: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [refreshTrigger, setRefreshTrigger] = useState(false);
//   const [userId, setUserId] = useState(null);

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

//   const fetchData = async () => {
//     try {
//       const res = await fetchUsers(headers);
//       const fetchedData = res.data.content;
//       if (fetchedData) {
//         const tableData = fetchedData.map((p) => ({
//           userId: p.userId,
//           userName: p.userName,
//           fullName: p.fullName,
//           email: p.email,
//           mobileNumber: p.mobileNumber,
//           password: p.password,
//           roleName: p.roleDto ? p.roleDto.roleName : 'No Role Name',
//           insertedDate: moment(p.insertedDate).format('L'),
//           updatedDate: moment(p.updatedDate).format('L'),
//           createdBy: p.createdBy ? p.createdBy.userName : 'No User',
//           updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
//         }));
//         setUsers(tableData);
//       } else {
//         setUsers([]);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const res = await fetchAllRoles(headers);
//       const fetchedData = res.data;
//       if (fetchedData) {
//         const sortedData = fetchedData.sort((a, b) => a.roleName.localeCompare(b.roleName));
//         const roleData = sortedData.map((c) => ({
//           roleId: c.roleId,
//           roleName: c.roleName
//         }));
//         setRoles(roleData);
//       }
//     } catch (error) {
//       console.error('Error fetching roles:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchRoles();
//   }, [refreshTrigger]);

//   const validateForm = () => {
//     const newErrors = {};

//     if (!userdata.userName || userdata.userName.trim() === '') {
//       newErrors.userName = 'Enter the user name';
//     }
//     if (!userdata.fullName || userdata.fullName.trim() === '') {
//       newErrors.fullName = 'Enter the full name';
//     }
//     if (!userdata.email || userdata.email.trim() === '') {
//       newErrors.email = 'Enter the email Id';
//     } else {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(userdata.email)) {
//         newErrors.email = 'Enter a valid email address';
//       }
//     }
//     if (!userdata.mobileNumber || userdata.mobileNumber.trim() === '') {
//       newErrors.mobileNumber = 'Enter the mobile number';
//     } else {
//       const mobileRegex = /^[0-9]{10,15}$/;
//       if (!mobileRegex.test(userdata.mobileNumber)) {
//         newErrors.mobileNumber = 'Enter a valid mobile number';
//       }
//     }
//     if (!userdata.password || userdata.password.trim() === '') {
//       newErrors.password = 'Enter the password';
//     } else if (userdata.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     if (!userdata.roleId) {
//       newErrors.roleId = 'Select a role';
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

//   // Open Add User Dialog
//   const handleAddUser = () => {
//     setEditMode(false);
//     setUserData({
//       userName: '',
//       fullName: '',
//       email: '',
//       mobileNumber: '',
//       password: '',
//       roleId: ''
//     });
//     setErrors({});
//     setOpen(true);
//   };

//   const postData = async (e) => {
//     e.preventDefault();

//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     const dataToPost = {
//       userName: userdata.userName,
//       fullName: userdata.fullName,
//       email: userdata.email,
//       mobileNumber: userdata.mobileNumber,
//       password: userdata.password,
//       roleDto: { roleId: userdata.roleId },
//       createdBy: { userId: user.userId }
//     };

//     try {
//       const response = await addUsers(dataToPost, headers);
//       if (response.data.responseCode === 201) {
//         setRefreshTrigger(!refreshTrigger);
//         setOpen(false);
//         fetchData();
//       } else {
//         alert(response.data.errorMessage || 'Failed to add user.');
//       }
//     } catch (error) { }
//   };

//   const handleEdit = async (userId) => {
//     setEditMode(true);
//     setOpen(true);
//     try {
//       const res = await getUsersById(userId, headers);
//       const det = res.data;
//       setUserId(det.userId);

//       setUserData({
//         userName: det.userName,
//         fullName: det.fullName,
//         email: det.email,
//         mobileNumber: det.mobileNumber,
//         password: det.password,
//         roleId: det.roleDto ? det.roleDto.roleId : ''
//       });
//       setErrors({});
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//     }
//   };

//   const updateData = async () => {
//     try {
//       const updatedData = {
//         ...userdata,
//         userId,
//         updatedBy: { userId: user.userId }
//       };
//       const resp = await updatedUsers(updatedData, headers);
//       setRefreshTrigger((prev) => !prev);
//       setOpen(false);
//     } catch (error) {
//       console.error('Error updating user:', error);
//     }
//   };

//   const handleDelete = async (userId) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       try {
//         await deleteUsers(userId, headers);
//         setRefreshTrigger((prev) => !prev);
//       } catch (error) {
//         console.error('Error deleting user:', error);
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formErrors = validateForm();

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     if (editMode) {
//       await updateData();
//     } else {
//       await postData(e);
//     }
//   };

//   return (
//     <MainCard
//       title={
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <span>Users</span>
//           <Box display="flex" alignItems="center" gap={1}>
//             {/* ✅ Added View Toggle Buttons */}
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
//               onClick={handleAddUser}
//               sx={{
//                 backgroundColor: "#03045E",
//                 '&:hover': {
//                   backgroundColor: "#03045E",
//                   opacity: 0.9
//                 }
//               }}
//             >
//               Add
//               <AddIcon sx={{ color: '#fff', ml: 1 }} />
//             </Button>
//           </Box>
//         </Box>
//       }
//     >
//       <Grid container spacing={gridSpacing}></Grid>
      
//       {/* ✅ Conditional Rendering based on viewMode */}
//       {viewMode === 'list' ? (
//         <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
//           <TableContainer sx={{ maxHeight: 440 }}>
//             <Table stickyHeader aria-label="sticky table">
//               <TableHead>
//                 <TableRow>
//                   {columns.map((column) => (
//                     <TableCell
//                       key={column.id}
//                       align={column.align ? column.align : 'left'}
//                       style={{ minWidth: column.minWidth, fontWeight: 600, fontSize: 15 }}
//                     >
//                       {column.label}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
//                   <TableRow hover role="checkbox" tabIndex={-1} key={row.userId}>
//                     {columns.map((column) => {
//                       const value = row[column.id];
//                       return (
//                         <TableCell key={column.id} align={column.align ? column.align : 'left'}>
//                           {column.id === 'actions' ? (
//                             <>
//                               <IconButton sx={{color:"#03045E"}} onClick={() => handleEdit(row.userId)}>
//                                 <Edit />
//                               </IconButton>
//                               <IconButton color="error" onClick={() => handleDelete(row.userId)}>
//                                 <DeleteForever />
//                               </IconButton>
//                             </>
//                           ) : (
//                             value || 'No Data'
//                           )}
//                         </TableCell>
//                       );
//                     })}
//                   </TableRow>
//                 ))}
//                 {users.length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} align="center">
//                       No users found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             rowsPerPageOptions={[10, 25, 100]}
//             component="div"
//             count={users.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </Paper>
//       ) : (
//         // ✅ User Cards View
//         <UsersCards
//           users={users}
//           page={page}
//           rowsPerPage={rowsPerPage}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       )}

//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit User' : 'Add User'}</DialogTitle>
//         <Box component="form" noValidate sx={{ p: 3 }} onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="User Name"
//                 name="userName"
//                 value={userdata.userName}
//                 onChange={changeHandler}
//                 error={!!errors.userName}
//                 helperText={errors.userName}
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
//                 label="Email"
//                 name="email"
//                 value={userdata.email}
//                 onChange={changeHandler}
//                 error={!!errors.email}
//                 helperText={errors.email}
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
//                 label="Password"
//                 name="password"
//                 type="password"
//                 value={userdata.password}
//                 onChange={changeHandler}
//                 error={!!errors.password}
//                 helperText={errors.password}
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
//               <FormControl fullWidth error={!!errors.roleId} sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '&.Mui-focused fieldset': {
//                     borderColor: '#03045E',
//                   },
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': {
//                   color: '#03045E',
//                 },
//               }}>
//                 <InputLabel>Role</InputLabel>
//                 <Select name="roleId" value={userdata.roleId} onChange={changeHandler} label="Role">
//                   {roles.map((role) => (
//                     <MenuItem key={role.roleId} value={role.roleId}>
//                       {role.roleName}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {errors.roleId && <FormHelperText>{errors.roleId}</FormHelperText>}
//               </FormControl>
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

// export default Users;



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
//   FormHelperText,
//   IconButton,
//   ToggleButtonGroup,
//   ToggleButton
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
// import MainCard from 'ui-component/cards/MainCard';
// import { gridSpacing } from 'store/constant';
// import { useState, useEffect } from 'react';
// import moment from 'moment';
// import { useTheme } from '@mui/material/styles';
// import { addUsers, deleteUsers, fetchUsers, getUsersById, updatedUsers } from 'views/API/UsersApi';
// import { fetchAllRoles } from 'views/API/RoleApi';
// import UsersCards from './UsersCards';

// const columns = [
//   { id: 'rowNumber', label: '#', align: 'center' },
//   { id: 'userId', label: 'ID', align: 'center' },
//   { id: 'userName', label: 'Name', align: 'center' },
//   { id: 'email', label: 'Email', align: 'center' },
//   { id: 'mobileNumber', label: 'Mobile Number', align: 'center' },
//   { id: 'roleName', label: 'Role', minWidth: 150, align: 'center' },
//   { id: 'createdBy', label: 'Created By', align: 'center' },
//   { id: 'updatedBy', label: 'Updated By', align: 'center' },
//   { id: 'insertedDate', label: 'Inserted Date', align: 'center' },
//   { id: 'updatedDate', label: 'Updated Date', align: 'center' },
//   { id: 'actions', label: 'Actions', align: 'center' }
// ];

// const Users = () => {
//   const theme = useTheme();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [roles, setRoles] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [viewMode, setViewMode] = useState('list');
//   const [userdata, setUserData] = useState({
//     userName: '',
//     fullName: '',
//     email: '',
//     mobileNumber: '',
//     password: '',
//     roleId: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [refreshTrigger, setRefreshTrigger] = useState(false);
//   const [userId, setUserId] = useState(null);

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

//   const fetchData = async () => {
//     try {
//       const res = await fetchUsers(headers);
//       const fetchedData = res.data.content;
//       if (fetchedData) {
//         // Sort by userId in ascending order
//         const sortedData = fetchedData.sort((a, b) => a.userId - b.userId);
        
//         const tableData = sortedData.map((p) => ({
//           userId: p.userId,
//           userName: p.userName,
//           fullName: p.fullName,
//           email: p.email,
//           mobileNumber: p.mobileNumber,
//           password: p.password,
//           roleName: p.roleDto ? p.roleDto.roleName : 'No Role Name',
//           insertedDate: moment(p.insertedDate).format('L'),
//           updatedDate: moment(p.updatedDate).format('L'),
//           createdBy: p.createdBy ? p.createdBy.userName : 'No User',
//           updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
//         }));
//         setUsers(tableData);
//       } else {
//         setUsers([]);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const res = await fetchAllRoles(headers);
//       const fetchedData = res.data;
//       if (fetchedData) {
//         const sortedData = fetchedData.sort((a, b) => a.roleName.localeCompare(b.roleName));
//         const roleData = sortedData.map((c) => ({
//           roleId: c.roleId,
//           roleName: c.roleName
//         }));
//         setRoles(roleData);
//       }
//     } catch (error) {
//       console.error('Error fetching roles:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchRoles();
//   }, [refreshTrigger]);

//   const validateForm = () => {
//     const newErrors = {};

//     if (!userdata.userName || userdata.userName.trim() === '') {
//       newErrors.userName = 'Enter the user name';
//     }
//     if (!userdata.fullName || userdata.fullName.trim() === '') {
//       newErrors.fullName = 'Enter the full name';
//     }
//     if (!userdata.email || userdata.email.trim() === '') {
//       newErrors.email = 'Enter the email Id';
//     } else {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(userdata.email)) {
//         newErrors.email = 'Enter a valid email address';
//       }
//     }
//     if (!userdata.mobileNumber || userdata.mobileNumber.trim() === '') {
//       newErrors.mobileNumber = 'Enter the mobile number';
//     } else {
//       const mobileRegex = /^[0-9]{10,15}$/;
//       if (!mobileRegex.test(userdata.mobileNumber)) {
//         newErrors.mobileNumber = 'Enter a valid mobile number';
//       }
//     }
//     if (!userdata.password || userdata.password.trim() === '') {
//       newErrors.password = 'Enter the password';
//     } else if (userdata.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     if (!userdata.roleId) {
//       newErrors.roleId = 'Select a role';
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

//   const handleAddUser = () => {
//     setEditMode(false);
//     setUserData({
//       userName: '',
//       fullName: '',
//       email: '',
//       mobileNumber: '',
//       password: '',
//       roleId: ''
//     });
//     setErrors({});
//     setOpen(true);
//   };

//   const postData = async (e) => {
//     e.preventDefault();

//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     const dataToPost = {
//       userName: userdata.userName,
//       fullName: userdata.fullName,
//       email: userdata.email,
//       mobileNumber: userdata.mobileNumber,
//       password: userdata.password,
//       roleDto: { roleId: userdata.roleId },
//       createdBy: { userId: user.userId }
//     };

//     try {
//       const response = await addUsers(dataToPost, headers);
//       if (response.data.responseCode === 201) {
//         setRefreshTrigger(!refreshTrigger);
//         setOpen(false);
//         fetchData();
//       } else {
//         alert(response.data.errorMessage || 'Failed to add user.');
//       }
//     } catch (error) { }
//   };

//   const handleEdit = async (userId) => {
//     setEditMode(true);
//     setOpen(true);
//     try {
//       const res = await getUsersById(userId, headers);
//       const det = res.data;
//       setUserId(det.userId);

//       setUserData({
//         userName: det.userName,
//         fullName: det.fullName,
//         email: det.email,
//         mobileNumber: det.mobileNumber,
//         password: det.password,
//         roleId: det.roleDto ? det.roleDto.roleId : ''
//       });
//       setErrors({});
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//     }
//   };

//   const updateData = async () => {
//     try {
//       const updatedData = {
//         ...userdata,
//         userId,
//         updatedBy: { userId: user.userId }
//       };
//       const resp = await updatedUsers(updatedData, headers);
//       setRefreshTrigger((prev) => !prev);
//       setOpen(false);
//     } catch (error) {
//       console.error('Error updating user:', error);
//     }
//   };

//   const handleDelete = async (userId) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       try {
//         await deleteUsers(userId, headers);
//         setRefreshTrigger((prev) => !prev);
//       } catch (error) {
//         console.error('Error deleting user:', error);
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formErrors = validateForm();

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     if (editMode) {
//       await updateData();
//     } else {
//       await postData(e);
//     }
//   };

//   return (
//     <MainCard
//       title={
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <span>Users</span>
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
//               onClick={handleAddUser}
//               sx={{
//                 backgroundColor: "#03045E",
//                 '&:hover': {
//                   backgroundColor: "#03045E",
//                   opacity: 0.9
//                 }
//               }}
//             >
//               Add
//               <AddIcon sx={{ color: '#fff', ml: 1 }} />
//             </Button>
//           </Box>
//         </Box>
//       }
//     >
//       <Grid container spacing={gridSpacing}></Grid>
      
//       {viewMode === 'list' ? (
//         <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
//           <TableContainer sx={{ maxHeight: 440 }}>
//             <Table stickyHeader aria-label="sticky table">
//               <TableHead>
//                 <TableRow>
//                   {columns.map((column) => (
//                     <TableCell
//                       key={column.id}
//                       align={column.align ? column.align : 'left'}
//                       style={{ minWidth: column.minWidth, fontWeight: 600, fontSize: 15 }}
//                     >
//                       {column.label}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
//                   <TableRow hover role="checkbox" tabIndex={-1} key={row.userId}>
//                     {columns.map((column) => {
//                       let value;
//                       if (column.id === 'rowNumber') {
//                         value = page * rowsPerPage + index + 1; // Sequential row number
//                       } else {
//                         value = row[column.id];
//                       }
                      
//                       return (
//                         <TableCell key={column.id} align={column.align ? column.align : 'left'}>
//                           {column.id === 'actions' ? (
//                             <>
//                               <IconButton sx={{color:"#03045E"}} onClick={() => handleEdit(row.userId)}>
//                                 <Edit />
//                               </IconButton>
//                               <IconButton color="error" onClick={() => handleDelete(row.userId)}>
//                                 <DeleteForever />
//                               </IconButton>
//                             </>
//                           ) : (
//                             value || 'No Data'
//                           )}
//                         </TableCell>
//                       );
//                     })}
//                   </TableRow>
//                 ))}
//                 {users.length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} align="center">
//                       No users found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             rowsPerPageOptions={[10, 25, 100]}
//             component="div"
//             count={users.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </Paper>
//       ) : (
//         <UsersCards
//           users={users}
//           page={page}
//           rowsPerPage={rowsPerPage}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       )}

//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit User' : 'Add User'}</DialogTitle>
//         <Box component="form" noValidate sx={{ p: 3 }} onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="User Name"
//                 name="userName"
//                 value={userdata.userName}
//                 onChange={changeHandler}
//                 error={!!errors.userName}
//                 helperText={errors.userName}
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
//                 label="Email"
//                 name="email"
//                 value={userdata.email}
//                 onChange={changeHandler}
//                 error={!!errors.email}
//                 helperText={errors.email}
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
//                 label="Password"
//                 name="password"
//                 type="password"
//                 value={userdata.password}
//                 onChange={changeHandler}
//                 error={!!errors.password}
//                 helperText={errors.password}
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
//               <FormControl fullWidth error={!!errors.roleId} sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '&.Mui-focused fieldset': {
//                     borderColor: '#03045E',
//                   },
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': {
//                   color: '#03045E',
//                 },
//               }}>
//                 <InputLabel>Role</InputLabel>
//                 <Select name="roleId" value={userdata.roleId} onChange={changeHandler} label="Role">
//                   {roles.map((role) => (
//                     <MenuItem key={role.roleId} value={role.roleId}>
//                       {role.roleName}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {errors.roleId && <FormHelperText>{errors.roleId}</FormHelperText>}
//               </FormControl>
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

// export default Users;


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
  FormHelperText,
  IconButton,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import { addUsers, deleteUsers, fetchUsers, getUsersById, updatedUsers } from 'views/API/UsersApi';
import { fetchAllRoles } from 'views/API/RoleApi';
import UsersCards from './UsersCards';

const columns = [
  { id: 'rowNumber', label: 'ID', align: 'center' },
  { id: 'userName', label: 'Name', align: 'center' },
  { id: 'email', label: 'Email', align: 'center' },
  { id: 'mobileNumber', label: 'Mobile Number', align: 'center' },
  { id: 'roleName', label: 'Role', minWidth: 150, align: 'center' },
  { id: 'createdBy', label: 'Created By', align: 'center' },
  { id: 'updatedBy', label: 'Updated By', align: 'center' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'center' },
  { id: 'updatedDate', label: 'Updated Date', align: 'center' },
  { id: 'actions', label: 'Actions', align: 'center' }
];

const Users = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [userdata, setUserData] = useState({
    userName: '',
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    roleId: ''
  });
  const [errors, setErrors] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [userId, setUserId] = useState(null);

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

  const fetchData = async () => {
    try {
      const res = await fetchUsers(headers);
      const fetchedData = res.data.content;
      if (fetchedData) {
        // Sort by userId in ascending order
        const sortedData = fetchedData.sort((a, b) => a.userId - b.userId);
        
        const tableData = sortedData.map((p) => ({
          userId: p.userId,
          userName: p.userName,
          fullName: p.fullName,
          email: p.email,
          mobileNumber: p.mobileNumber,
          password: p.password,
          roleName: p.roleDto ? p.roleDto.roleName : 'No Role Name',
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy ? p.createdBy.userName : 'No User',
          updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
        }));
        setUsers(tableData);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetchAllRoles(headers);
      const fetchedData = res.data;
      if (fetchedData) {
        const sortedData = fetchedData.sort((a, b) => a.roleName.localeCompare(b.roleName));
        const roleData = sortedData.map((c) => ({
          roleId: c.roleId,
          roleName: c.roleName
        }));
        setRoles(roleData);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRoles();
  }, [refreshTrigger]);

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.userName || userdata.userName.trim() === '') {
      newErrors.userName = 'Enter the user name';
    }
    if (!userdata.fullName || userdata.fullName.trim() === '') {
      newErrors.fullName = 'Enter the full name';
    }
    if (!userdata.email || userdata.email.trim() === '') {
      newErrors.email = 'Enter the email Id';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userdata.email)) {
        newErrors.email = 'Enter a valid email address';
      }
    }
    if (!userdata.mobileNumber || userdata.mobileNumber.trim() === '') {
      newErrors.mobileNumber = 'Enter the mobile number';
    } else {
      const mobileRegex = /^[0-9]{10,15}$/;
      if (!mobileRegex.test(userdata.mobileNumber)) {
        newErrors.mobileNumber = 'Enter a valid mobile number';
      }
    }
    if (!userdata.password || userdata.password.trim() === '') {
      newErrors.password = 'Enter the password';
    } else if (userdata.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!userdata.roleId) {
      newErrors.roleId = 'Select a role';
    }

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

  const handleAddUser = () => {
    setEditMode(false);
    setUserData({
      userName: '',
      fullName: '',
      email: '',
      mobileNumber: '',
      password: '',
      roleId: ''
    });
    setErrors({});
    setOpen(true);
  };

  const postData = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dataToPost = {
      userName: userdata.userName,
      fullName: userdata.fullName,
      email: userdata.email,
      mobileNumber: userdata.mobileNumber,
      password: userdata.password,
      roleDto: { roleId: userdata.roleId },
      createdBy: { userId: user.userId }
    };

    try {
      const response = await addUsers(dataToPost, headers);
      if (response.data.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
        fetchData();
      } else {
        alert(response.data.errorMessage || 'Failed to add user.');
      }
    } catch (error) { }
  };

  const handleEdit = async (userId) => {
    setEditMode(true);
    setOpen(true);
    try {
      const res = await getUsersById(userId, headers);
      const det = res.data;
      setUserId(det.userId);

      setUserData({
        userName: det.userName,
        fullName: det.fullName,
        email: det.email,
        mobileNumber: det.mobileNumber,
        password: det.password,
        roleId: det.roleDto ? det.roleDto.roleId : ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const updateData = async () => {
    try {
      const updatedData = {
        ...userdata,
        userId,
        updatedBy: { userId: user.userId }
      };
      const resp = await updatedUsers(updatedData, headers);
      setRefreshTrigger((prev) => !prev);
      setOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUsers(userId, headers);
        setRefreshTrigger((prev) => !prev);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (editMode) {
      await updateData();
    } else {
      await postData(e);
    }
  };

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Users</span>
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
              onClick={handleAddUser}
              sx={{
                backgroundColor: "#03045E",
                '&:hover': {
                  backgroundColor: "#03045E",
                  opacity: 0.9
                }
              }}
            >
              Add
              <AddIcon sx={{ color: '#fff', ml: 1 }} />
            </Button>
          </Box>
        </Box>
      }
    >
      <Grid container spacing={gridSpacing}></Grid>
      
      {viewMode === 'list' ? (
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align ? column.align : 'left'}
                      style={{ minWidth: column.minWidth, fontWeight: 600, fontSize: 15 }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.userId}>
                    {columns.map((column) => {
                      let value;
                      if (column.id === 'rowNumber') {
                        value = page * rowsPerPage + index + 1; // Sequential row number
                      } else {
                        value = row[column.id];
                      }
                      
                      return (
                        <TableCell key={column.id} align={column.align ? column.align : 'left'}>
                          {column.id === 'actions' ? (
                            <>
                              <IconButton sx={{color:"#03045E"}} onClick={() => handleEdit(row.userId)}>
                                <Edit />
                              </IconButton>
                              <IconButton color="error" onClick={() => handleDelete(row.userId)}>
                                <DeleteForever />
                              </IconButton>
                            </>
                          ) : (
                            value || 'No Data'
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <UsersCards
          users={users}
          page={page}
          rowsPerPage={rowsPerPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit User' : 'Add User'}</DialogTitle>
        <Box component="form" noValidate sx={{ p: 3 }} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User Name"
                name="userName"
                value={userdata.userName}
                onChange={changeHandler}
                error={!!errors.userName}
                helperText={errors.userName}
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
                label="Full Name"
                name="fullName"
                value={userdata.fullName}
                onChange={changeHandler}
                error={!!errors.fullName}
                helperText={errors.fullName}
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
                label="Email"
                name="email"
                value={userdata.email}
                onChange={changeHandler}
                error={!!errors.email}
                helperText={errors.email}
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
                label="Mobile Number"
                name="mobileNumber"
                value={userdata.mobileNumber}
                onChange={changeHandler}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber}
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
                label="Password"
                name="password"
                type="password"
                value={userdata.password}
                onChange={changeHandler}
                error={!!errors.password}
                helperText={errors.password}
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
              <FormControl fullWidth error={!!errors.roleId} sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#03045E',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#03045E',
                },
              }}>
                <InputLabel>Role</InputLabel>
                <Select name="roleId" value={userdata.roleId} onChange={changeHandler} label="Role">
                  {roles.map((role) => (
                    <MenuItem key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.roleId && <FormHelperText>{errors.roleId}</FormHelperText>}
              </FormControl>
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

export default Users;