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
import { BaseUrl } from 'BaseUrl';
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Box, Button, Dialog, DialogActions, DialogTitle, TextField, Container, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { DeleteForever, Edit } from '@mui/icons-material';
import { addUniversity, deleteUniversity, fetchUniversities, getUniveristy_ById, updatedUniversity } from 'views/API/UniversityApi';
import Swal from 'sweetalert2';
import { minHeight, minWidth } from '@mui/system';






const columns = [
  { id: 'universityId', label: 'ID', align: 'center' },
  // {id:'universitycode' , label:"University Code", align:'center'},
  { id: 'universityName', label: 'Name', align: 'center' },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'file', label: 'File', align: 'center' },
  { id: 'createdBy', label: 'Created By', align: 'center' },
  { id: 'updatedBy', label: 'Updated By', align: 'center' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'center' },
  { id: 'updatedDate', label: 'Updated Date', align: 'center' },
  { id: 'actions', label: 'Actions', align: 'center' }
];

const University = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [advertisement, setAdvertisement] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userdata, setUserData] = useState({
    universityName: '',
    description: '',
    // universityCode: '',
    universityPicName:''
  });
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState('');
  const [universityPicName, setUniversityPicName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [universityId, setuniversityId] = useState(null);
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

  const FetchData = async () => {
    try {
      const res = await fetchUniversities(headers);
      const fetchedData = res.data.content;

      if (fetchedData) {
        const tableData = fetchedData.map((p) => ({
          universityId: p.universityId,
          universityName: p.universityName,
          description: p.description,
          file:
            p.universityPicPath === null ? (
              'NO IMAGE FOUND'
            ) : (
              <img src={ImageUrl + p.universityPicPath} alt={p.universityPicName} style={{ width: 100, height: 50 }} />
            ),
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy ? p.createdBy.userName : 'No User',
          updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
        }))
                .sort((a, b) => a.universityId - b.universityId); // For ascending by ID
        
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

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dataToPost = {
      ...userdata,
      createdBy: { userId: user.userId }
    };

    console.log(dataToPost);

    try {
      const response = await addUniversity(dataToPost, headers);
      if (response.data.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
        FetchData();
      } else {
        alert(response.data.errorMessage || 'Failed to add University.');
      }
    } catch (error) { }
    // setOpen(false);
    FetchData();
  };

  const updateData = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const updatedDataPayload = {
      universityId: universityId,
      universityName: userdata.universityName,
      description: userdata.description,
      universityPicName,
      updatedBy: { userId: user.userId }
    };
    console.log(updatedDataPayload);
    try {
      const response = await updatedUniversity(updatedDataPayload, headers);
      if (response.data.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
        setEditMode(false);
        setcollegeId(null);
        setUserData({
          universityName: '',
          description: '',
          universityPicName: '',
          // universityCode: det.universityCode || ''
        });
      } else {
        alert(response.data.errorMessage);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
    setOpen(false);
    FetchData();
  };

  const onFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setFileError('Please select a file');
      Swal.fire({
        icon: 'error',
        title: 'No file selected',
        text: 'Please select a file to upload.'
      });
      return;
    }

    const data = new FormData();
    data.append('file', selectedFile);

    try {
      const res = await axios.post(`${BaseUrl}/file/uploadFile`, data, {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: 'Bearer ' + user.accessToken
        }
      });

      setUniversityPicName(res.data.fileName);
      setUserData({ ...userdata, universityPicName: res.data.fileName });
      setFileError('');

      Swal.fire({
        target: document.getElementById("your-dialog-id"),
        icon: 'success',
        title: 'File Uploaded',
        text: res.data.message || 'Your file has been uploaded successfully!'
      });

    } catch (err) {
      console.error('Error uploading file:', err);

      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: err?.response?.data?.errorMessage || 'Something went wrong during upload.'
      });
    }
  };


  const onFileChange = (e) => {
    setUniversityPicName(e.target.files[0].name);
    setSelectedFile(e.target.files[0]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.universityName || userdata.universityName.trim() === '') {
      newErrors.universityName = 'Enter the university name';
    }

    if (!userdata.description || userdata.description.trim() === '') {
      newErrors.description = 'Enter the description';
    }

    if (!userdata.universityPicName || userdata.universityPicName.trim() === '') {
      newErrors.universityPicName = 'Select the file';
    }

//     if (!userdata.universityCode || userdata.universityCode.trim() === '') {
//   newErrors.universityCode = 'Enter the university code';
// }

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
      universityName: '',
      description: '',
      universityPicName: ''
    });
    setOpen(true);
  };

  const handleEdit = async (universityId) => {
    setEditMode(true);
    setOpen(true);
    try {
      const res = await getUniveristy_ById(universityId, headers);
      const det = res.data;
      console.log(det);

      setuniversityId(det.universityId);
      setUserData({
        universityName: det.universityName,
        description: det.description,
        universityPicName: det.universityPicName
      });
    } catch (error) {
      console.error('Error fetching university details:', error);
    }
  };

const handleDelete = async (universityId) => {
  const success = await deleteUniversity(universityId, headers);
  if (success) {
    setRefreshTrigger(prev => !prev); // Trigger data refresh
  }
};

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>University</span>
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
            onClick={handleAddBanner}
          >
            Add
            <AddIcon sx={{ color: '#fff' }} />
          </Button>
        </Box>
      }
    >
      <Grid container spacing={gridSpacing}></Grid>
      {/* Universities  */}
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
                <TableRow hover role="checkbox" tabIndex={-1} key={row.universityId}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'actions' ? (
                        <>
                          <IconButton onClick={() => handleEdit(row.universityId)} sx={{color: "#03045E"}}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(row.universityId)} color="error">
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
            {/* <TableBody>
  {advertisement.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
    <TableRow hover role="checkbox" tabIndex={-1} key={row.universityId}>
      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
      {columns.filter(col => col.id !== 'moduleId').map((column) => (
        <TableCell key={column.id} align={column.align}>
          {column.id === 'actions' ? (
            <>
              <IconButton onClick={() => handleEdit(row.universityId)} sx={{color: "#03045E"}}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDelete(row.universityId)} color="error">
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
</TableBody> */}
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
      

      {/* Add University details  */}
      <Dialog open={open} onClose={()  => setOpen(false)} fullWidth maxWidth="md" id="your-dialog-id">
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit University' : 'Add University'}</DialogTitle>
        <Box component="form" onSubmit={editMode ? updateData : postData} noValidate sx={{ p: 3 }}>
          
          <Grid container spacing={2}>

              {/* <Grid item xs={12}>
  <TextField
    fullWidth
    label="University Code"
    name="universityCode"
    value={userdata.universityCode}
    onChange={changeHandler}
    error={!!errors.universityCode}
    helperText={errors.universityCode}
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

        
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="University Name"
                name="universityName"
                value={userdata.universityName}
                onChange={changeHandler}
                error={!!errors.universityName}
                helperText={errors.universityName}
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
    fullWidth
    margin="normal"
    label="File Name"
    name="universityPicName"
    value={userdata.universityPicName}
    disabled
    error={!!errors.universityPicName}
    helperText={errors.universityPicName}
    InputProps={{
      endAdornment: (
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#03045E",
            '&:hover': {
              backgroundColor: "#03045E",
              opacity: 0.9
            }
          }}
          onClick={onFileUpload}
        >
          Upload
        </Button>
      )
    }}
  />
  <input
    type="file"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        setUserData((prev) => ({
          ...prev,
          universityPicName: file.name
        }));
        setErrors((prev) => ({
          ...prev,
          universityPicName: ""
        }));
      }
    }}
    ref={inputRef}
    style={{ marginTop: 20 }}
  />
</Grid>

            {/* <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                id="universityPicName"
                label="File Name"
                name="universityPicName"
                autoComplete="universityPicName"
                value={userdata.universityPicName}
                disabled
                helperText={errors.universityPicName}
                error={!!errors.universityPicName}
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
            </Grid> */}

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
              {editMode ? 'Update' : 'Save'}{' '}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </MainCard>
  );
};

export default University;
