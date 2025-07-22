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
import { Box, Button, Dialog, DialogActions, DialogTitle, TextField, Container, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { DeleteForever, Edit } from '@mui/icons-material';
import { deleteCandidate, fetchCandidates, getCandidateById, updateCandidates } from 'views/API/UsersApi';

const columns = [
  { id: 'mobileUserId', label: 'ID', align: 'center' },
  { id: 'file', label: 'File', align: 'center' },
  { id: 'fullName', label: 'Name', align: 'center' },
  { id: 'mobileNumber', label: 'Mobile Number', minWidth: 150, align: 'center' },
  { id: 'mailId', label: 'Mail ID', minWidth: 150, align: 'center' },
  { id: 'createdBy', label: 'Created By', align: 'center' },
  { id: 'updatedBy', label: 'Updated By', align: 'center' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'center' },
  { id: 'updatedDate', label: 'Updated Date', align: 'center' },
  { id: 'actions', label: 'Actions', align: 'center' }
];

const Candidates = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [advertisement, setAdvertisement] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userdata, setUserData] = useState({
    fullName: '',
    mobileNumber: '',
    mailId: '',
    fileName: ''
  });
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedFile, setselectedFile] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [advertisementId, setAdvertisementId] = useState(null);
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
      const res = await fetchCandidates(headers);
      const fetchedData = res.data.content;
      console.log(fetchedData)

      if (fetchedData) {
        const tableData = fetchedData.map((p) => ({
          mobileUserId: p.mobileUserId,
          fullName: p.fullName,
          mobileNumber: p.mobileNumber,
          mailId: p.mailId === null ? "Email not found" : p.mailId,
          file:
            p.profilePicPath === null ? (
              'NO IMAGE FOUND'
            ) : (
              <img src={ImageUrl + p.profilePicPath} alt={p.profilePicName} style={{ width: 100, height: 50 }} />
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

  const onFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setFileError("Please select a file");
      return;
    }

    const data = new FormData();
    data.append("file", selectedFile);

    try {
      const res = await axios.post(`${BaseUrl}/file/uploadFile`, data, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: "Bearer " + user.accessToken,
        },
      });

      setFileName(res.data.fileName);
      setUserData({ ...userdata, profilePicName: res.data.fileName });
      console.log(res.data);
      alert(res.data.message);
      setFileError("");
    } catch (error) {
      console.error("Error uploading file:", error);
      setFileError("Error uploading file: " + error.message);
    }
  };

  const onFileChange = (e) => {
    setFileName(e.target.files[0].name);
    setselectedFile(e.target.files[0]);
    if (!selectedFile) {
      // alert("image is selected");
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.fullName || userdata.fullName.trim() === '') {
      newErrors.fullName = 'Enter the name';
    }

    if (!userdata.mobileNumber || userdata.mobileNumber.trim() === '') {
      newErrors.mobileNumber = 'Enter the mobile Number';
    }
    if (!userdata.mailId || userdata.mailId.trim() === '') {
      newErrors.mailId = 'Enter the mobile Number';
    }

    // if (!userdata.fileName || userdata.fileName.trim() === '') {
    //   newErrors.fileName = 'Select the file';
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

  const handleAddCandidate = () => {
    setEditMode(false);
    setUserData({
      fullName: '',
      mobileNumber: '',
      mailId: '',
      fileName: ''
    });
    setOpen(true);
  };

  const handleEdit = async (mobileUserId) => {
    setEditMode(true);
    setOpen(true);
    try {
      const res = await getCandidateById(mobileUserId, headers);
      const det = res.data;
      console.log(det)

      setAdvertisementId(det.mobileUserId);
      setUserData({
        fullName: det.fullName,
        mobileNumber: det.mobileNumber,
        mailId: det.mailId,
        profilePicName: det.profilePicName,
      });
    } catch (error) {
      console.error('Error fetching advertisement details:', error);
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
      fullName: userdata.fullName,
      mobileNumber: userdata.mobileNumber,
      mailId: userdata.mailId,
      updatedBy: { userId: user.userId }
    };

    console.log(updatedDataPayload);

    try {
      const response = await updateCandidates(updatedDataPayload, headers);
      if (response.data.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
        setEditMode(false);
        setModuletId(null);
        setUserData({
          fullName: '',
          mobileNumber: '',
          mailId: '',
        });
        setSelectedCourses([]);
        FetchData();
      } else {
        alert(response.data.errorMessage);
      }
    } catch (error) { }
    FetchData();
    // setOpen(false);
  };

  const handleDelete = async (mobileUserId) => {
    try {
      await deleteCandidate(mobileUserId, headers);
      FetchData();
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Candidates</span>
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
            onClick={handleAddCandidate}
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
              {advertisement.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.advertisementId}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'actions' ? (
                        <>
                          <IconButton onClick={() => handleEdit(row.mobileUserId)} sx={{ color: "#03045E" }}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(row.mobileUserId)} color="error">
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
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Candidate' : 'Add Candidate'}</DialogTitle>
        <Box component="form" onSubmit={editMode ? updateData : postData} noValidate sx={{ p: 3 }}>
          <Grid container spacing={2}>
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
                label="Mail Id"
                name="mailId"
                value={userdata.mailId}
                onChange={changeHandler}
                error={!!errors.mailId}
                helperText={errors.mailId}
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
                id="profilePicName"
                label="File Name"
                name="profilePicName"
                autoComplete="profilePicName"
                value={userdata.profilePicName}
                disabled
                helperText={errors.profilePicName}
                error={!!errors.profilePicName}
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

export default Candidates;
