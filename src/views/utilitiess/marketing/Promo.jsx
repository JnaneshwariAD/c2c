// import * as React from 'react';
// import {
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Grid,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogTitle,
//   IconButton,
//   TextField,
//   Box
// } from '@mui/material';
// import MainCard from 'ui-component/cards/MainCard';
// import { gridSpacing } from 'store/constant';
// import { useState, useEffect, useRef } from 'react';
// import moment from 'moment';
// import AddIcon from '@mui/icons-material/Add';
// import { DeleteForever, Edit } from '@mui/icons-material';
// import { deletePromo, fetchPromo, getPromoById, postPromoData, updatedPromo } from 'views/API/PromoApi';

// const columns = [
//   { id: 'promoId', label: 'ID', align: 'center' },
//   { id: 'promoName', label: 'Name', align: 'center' },
//   { id: 'description', label: 'Description', minWidth: 100, align: 'center' },
//   {
//     id: 'youTube',
//     label: 'Youtube',
//     align: 'center',
//     format: (value) => (
//       value ? (
//         <iframe
//           width="150"
//           height="100"
//           src={`https://www.youtube.com/embed/${extractVideoId(value)}`}
//           frameBorder="0"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//         ></iframe>
//       ) : 'No video'
//     )
//   },
//   { id: 'createdBy', label: 'Created By', align: 'center' },
//   { id: 'updatedBy', label: 'Updated By', align: 'center' },
//   { id: 'insertedDate', label: 'Inserted Date', align: 'center' },
//   { id: 'updatedDate', label: 'Updated Date', align: 'center' },
//   { id: 'actions', label: 'Actions', align: 'center' }
// ];


// function extractVideoId(url) {
//   // Handle various YouTube URL formats
//   const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//   const match = url.match(regExp);
//   return (match && match[2].length === 11) ? match[2] : null;
// }

// const Promo = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [promo, setPromo] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [promoId, setPromoId] = useState(null);
//   const inputRef = useRef(null);
//   const [refreshTrigger, setRefreshTrigger] = useState(false);

//   const [userdata, setUserData] = useState({
//     promoName: '',
//     description: '',
//     youTube: ''
//   });

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




//   const validateForm = () => {
//     const newErrors = {};

//     if (!userdata.promoName || userdata.promoName.trim() === '') {
//       newErrors.promoName = 'Enter the Advertisement name';
//     }

//     if (!userdata.description || userdata.description.trim() === '') {
//       newErrors.description = 'Enter the description';
//     }

//     if (!userdata.youTube || userdata.youTube.trim() === '') {
//       newErrors.youTube = 'Enter Youtube URL';
//     }

//     return newErrors;
//   };

//   const fetchData = async () => {
//     try {
//       const res = await fetchPromo(headers);
//       const fetchedData = res.content;

//       if (fetchedData) {
//         const tableData = fetchedData.map((p) => ({
//           promoId: p.promoId,
//           promoName: p.promoName,
//           description: p.description,
//           youTube: p.youTube,
//           insertedDate: moment(p.insertedDate).format('L'),
//           updatedDate: moment(p.updatedDate).format('L'),
//           createdBy: p.createdBy ? p.createdBy.userName : 'No User',
//           updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
//         }));

//         setPromo(tableData);
//       } else {
//         setPromo([]);
//       }
//     } catch (error) {
//       console.error('Error fetching promo data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [refreshTrigger]);

//   const handleDelete = async (id) => {
//     await deletePromo(headers, id);
//     fetchData();
//   };

//   const handleEdit = async (id) => {
//     setEditMode(true);
//     setOpen(true);

//     try {

//       const res = await getPromoById(headers, id);
//       const det = res.data;

//       if (det) {

//         setPromoId(det.promoId);
//         setUserData({
//           promoName: det.promoName,
//           description: det.description,
//           youTube: det.youTube
//         });
//       } else {

//         console.error('No promo data found for id:', id);
//       }
//     } catch (error) {
//       console.error('Error fetching promo details:', error);
//     }
//   };

//   const handleAddPromo = () => {
//     setEditMode(false);
//     setUserData({
//       promoName: '',
//       description: '',
//       youTube: ''
//     });
//     setOpen(true);
//   };

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
//             promoId,
//             updatedBy: { userId: user.userId }
//           };


//           await updatedPromo(updatedData, headers);
//         } else {
//           await postPromoData(
//             {
//               ...userdata,
//               createdBy: { userId: user.userId }
//             },
//             headers
//           );
//         }
//         setUserData({ promoName: '', description: '', youTube: '' });
//         inputRef.current.value = null;
//         setRefreshTrigger((prev) => !prev);
//         setOpen(false);
//       } catch (error) {
//         console.error('Error saving promo:', error);
//       }
//     }
//   };

//   return (
//     <MainCard
//       title={
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <span>Promo</span>
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
//             onClick={handleAddPromo}
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
//               {promo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
//                 <TableRow hover role="checkbox" tabIndex={-1} key={row.promoId}>
//                   {columns.map((column) => (
//                     <TableCell key={column.id} align={column.align}>
//                       {column.id === 'actions' ? (
//                         <>
//                           <IconButton onClick={() => handleEdit(row.promoId)} sx={{
//                             color: "#03045E"
//                           }}>
//                             <Edit />
//                           </IconButton>
//                           <IconButton onClick={() => handleDelete(row.promoId)} color="error">
//                             <DeleteForever />
//                           </IconButton>
//                         </>
//                       ) : column.format ? (
//                         column.format(row[column.id])
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
//           count={promo.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>

//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Promo' : 'Add Promo'}</DialogTitle>
//         <Box component="form" onSubmit={postData} noValidate sx={{ p: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Promo Name"
//                 name="promoName"
//                 value={userdata.promoName}
//                 onChange={changeHandler}
//                 error={!!errors.promoName}
//                 helperText={errors.promoName}
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
//                 label="YouTube URL"
//                 name="youTube"
//                 value={userdata.youTube}
//                 onChange={changeHandler}
//                 error={!!errors.youTube}
//                 helperText={errors.youTube}
//                 inputRef={inputRef}
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
//           </Grid>
//           <DialogActions sx={{ pt: 3 }}>
//             <Button onClick={() => setOpen(false)} sx={{ color: "#03045E" }}>Cancel</Button>
//             <Button type="submit" variant="contained" color="primary" sx={{
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

// export default Promo;


import * as React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  TextField,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
import { deletePromo, fetchPromo, getPromoById, postPromoData, updatedPromo } from 'views/API/PromoApi';

const columns = [
  { id: 'promoId', label: 'ID', align: 'center' },
  { id: 'promoName', label: 'Name', align: 'center' },
  { id: 'description', label: 'Description', minWidth: 100, align: 'center' },
  {
    id: 'youTube',
    label: 'Youtube',
    align: 'center',
    format: (value) => (
      value ? (
        <iframe
          width="150"
          height="100"
          src={`https://www.youtube.com/embed/${extractVideoId(value)}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : 'No video'
    )
  },
  { id: 'createdBy', label: 'Created By', align: 'center' },
  { id: 'updatedBy', label: 'Updated By', align: 'center' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'center' },
  { id: 'updatedDate', label: 'Updated Date', align: 'center' },
  { id: 'actions', label: 'Actions', align: 'center' }
];

function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// PromoCard Component for card view
const PromoCard = ({ promo, onEdit, onDelete }) => {
  const videoId = extractVideoId(promo.youTube);

  return (
    <Card sx={{ 
      height: 400, 
      display: 'flex', 
      flexDirection: 'column',
      border: '1px solid #ddd',
      borderRadius: 2,
      transition: '0.3s',
      '&:hover': {
        boxShadow: 6,
        transform: 'translateY(-4px)',
      },
    }}>
      {videoId && (
        <CardMedia
          component="iframe"
          height="200"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allowFullScreen
          sx={{ border: 'none' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
          {promo.promoName}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {promo.description}
        </Typography>
        {/* <Typography variant="caption" display="block" color="text.secondary">
          Created: {promo.insertedDate}
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
          By: {promo.createdBy}
        </Typography> */}
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Grid container spacing={1} justifyContent="center">
          <Grid item>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => onEdit(promo.promoId)} 
            >
              View More
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => onEdit(promo.promoId)} 
            >
              Edit
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => onDelete(promo.promoId)}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

const Promo = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [promo, setPromo] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // ✅ Added view mode state
  const [errors, setErrors] = useState({});
  const [promoId, setPromoId] = useState(null);
  const inputRef = useRef(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [userdata, setUserData] = useState({
    promoName: '',
    description: '',
    youTube: ''
  });

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

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.promoName || userdata.promoName.trim() === '') {
      newErrors.promoName = 'Enter the Promo name';
    }

    if (!userdata.description || userdata.description.trim() === '') {
      newErrors.description = 'Enter the description';
    }

    if (!userdata.youTube || userdata.youTube.trim() === '') {
      newErrors.youTube = 'Enter YouTube URL';
    }

    return newErrors;
  };

  const fetchData = async () => {
    try {
      const res = await fetchPromo(headers);
      const fetchedData = res.content;

      if (fetchedData) {
        const tableData = fetchedData.map((p) => ({
          promoId: p.promoId,
          promoName: p.promoName,
          description: p.description,
          youTube: p.youTube,
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy ? p.createdBy.userName : 'No User',
          updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
        }));

        setPromo(tableData);
      } else {
        setPromo([]);
      }
    } catch (error) {
      console.error('Error fetching promo data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    await deletePromo(headers, id);
    fetchData();
  };

  const handleEdit = async (id) => {
    setEditMode(true);
    setOpen(true);

    try {
      const res = await getPromoById(headers, id);
      const det = res.data;

      if (det) {
        setPromoId(det.promoId);
        setUserData({
          promoName: det.promoName,
          description: det.description,
          youTube: det.youTube
        });
      } else {
        console.error('No promo data found for id:', id);
      }
    } catch (error) {
      console.error('Error fetching promo details:', error);
    }
  };

  const handleAddPromo = () => {
    setEditMode(false);
    setUserData({
      promoName: '',
      description: '',
      youTube: ''
    });
    setOpen(true);
  };

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
            promoId,
            updatedBy: { userId: user.userId }
          };

          await updatedPromo(updatedData, headers);
        } else {
          await postPromoData(
            {
              ...userdata,
              createdBy: { userId: user.userId }
            },
            headers
          );
        }
        setUserData({ promoName: '', description: '', youTube: '' });
        inputRef.current.value = null;
        setRefreshTrigger((prev) => !prev);
        setOpen(false);
      } catch (error) {
        console.error('Error saving promo:', error);
      }
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Promo</span>
          <Box display="flex" alignItems="center" gap={1}>
            {/* ✅ Toggle Button Group for view mode */}
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
              onClick={handleAddPromo}
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
                {promo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.promoId}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'actions' ? (
                          <>
                            <IconButton onClick={() => handleEdit(row.promoId)} sx={{ color: "#03045E" }}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(row.promoId)} color="error">
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
            count={promo.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        // ✅ Card View
        <>
          <Grid container spacing={2}>
            {promo
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((promoItem) => (
                <Grid item xs={12} sm={6} md={4} key={promoItem.promoId}>
                  <PromoCard 
                    promo={promoItem} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                  />
                </Grid>
              ))}
          </Grid>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={promo.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ mt: 2 }}
          />
        </>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Promo' : 'Add Promo'}</DialogTitle>
        <Box component="form" onSubmit={postData} noValidate sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Promo Name"
                name="promoName"
                value={userdata.promoName}
                onChange={changeHandler}
                error={!!errors.promoName}
                helperText={errors.promoName}
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
                label="YouTube URL"
                name="youTube"
                value={userdata.youTube}
                onChange={changeHandler}
                error={!!errors.youTube}
                helperText={errors.youTube}
                inputRef={inputRef}
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
          </Grid>
          <DialogActions sx={{ pt: 3 }}>
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

export default Promo;