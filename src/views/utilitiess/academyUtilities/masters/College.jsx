import * as React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
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
import { DeleteForever, Edit } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import { addCollege, deleteCollege, fetchAllUniversities, fetchCollege, fetchCollegeById, updatedCollege } from 'views/API/CollegeApi';
import { BaseUrl } from 'BaseUrl';
import { useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import CollegeCards from './CollegeCards';

const columns = [
  { id: 'collegeId', label: 'ID', align: 'center' },
  { id: 'collegeName', label: 'Name', align: 'center' },
  { id: 'description', label: 'Description', minWidth: 100, align: 'center' },
  { id: 'universityName', label: 'University', align: 'center' },
  { id: 'file', label: 'File', minWidth: 100, align: 'center' },
  { id: 'webUrl', label: 'Web URL', minWidth: 400, align: 'center' },
  { id: 'address', label: 'Address', minWidth: 200, align: 'center' },
  { id: 'city', label: 'City', align: 'center' },
  { id: 'state', label: 'State', align: 'center' },
  { id: 'pincode', label: 'Pincode', align: 'center' },
  { id: 'createdBy', label: 'Created By', align: 'center' },
  { id: 'updatedBy', label: 'Updated By', align: 'center' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'center' },
  { id: 'updatedDate', label: 'Updated Date', align: 'center' },
  { id: 'actions', label: 'Actions', align: 'center' }
];

const College = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [courses, setCourses] = useState([]);
  const [universities, setuniversities] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userdata, setUserData] = useState({
    collegeName: '',
    description: '',
    webUrl: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [errors, setErrors] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [collegeId, setcollegeId] = useState(null);
  const [collegePicName, setCollegePicName] = useState('');
  const [fileError, setFileError] = useState('');
  const [selectedFile, setselectedFile] = useState(null);
  const [viewMode, setViewMode] = useState('list');
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
      const res = await fetchCollege(headers);
      const fetchedData = res.data.content;
      console.log(fetchedData);

      if (fetchedData) {
        const tableData = fetchedData.map((p) => ({
          collegeId: p.collegeId,
          collegeName: p.collegeName,
          description: p.description,
          universityName: p.universityDtoList ? p.universityDtoList.universityName : 'No university',
          file:
            p.collegePicPath === null ? (
              'NO IMAGE FOUND'
            ) : (
              <img src={ImageUrl + p.collegePicPath} alt={p.collegePicName} style={{ width: 100, height: 50 }} />
            ),
          webUrl: p.webUrl,
          address: p.address,
          city: p.city,
          state: p.state,
          pincode: p.pincode,
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy ? p.createdBy.userName : 'No User',
          updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
        }))
         .sort((a, b) => a.collegeId - b.collegeId); // For ascending by ID
        setCourses(tableData);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

  useEffect(() => {
    FetchData();
    fetchUniversities();
  }, [refreshTrigger]);

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.collegeName || userdata.collegeName.trim() === '') {
      newErrors.collegeName = 'Enter the college name';
    }

    if (!userdata.description || userdata.description.trim() === '') {
      newErrors.description = 'Enter the description';
    }
    if (!userdata.webUrl || userdata.webUrl.trim() === '') {
      newErrors.webUrl = 'Enter the webUrl';
    }

    if (!userdata.universityId) {
      newErrors.universityId = 'Select a univeristy';
    }

    if (!userdata.address || userdata.address.trim() === '') {
      newErrors.address = 'Enter the Address';
    }

    if (!userdata.city || userdata.city.trim() === '') {
      newErrors.city = 'Enter the City';
    }

    if (!userdata.state || userdata.state.trim() === '') {
      newErrors.state = 'Enter the State';
    }

    if (!userdata.pincode || userdata.pincode.trim() === '') {
      newErrors.pincode = 'Enter the Pincode';
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

  const handleAddCollege = () => {
    setEditMode(false);
    setUserData({
      collegeId: '',
      collegeName: '',
      description: '',
      webUrl: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    });
    setOpen(true);
  };

  const onFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setFileError('Please select a file');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select a file to upload!',
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

      // Update fileName and set userdata with collegePicName
      setCollegePicName(res.data.fileName);
      setUserData({ ...userdata, collegePicName: res.data.fileName });
      console.log(res.data);


      Swal.fire({
        target: document.getElementById("your-dialog-id"),
        icon: 'success',
        title: 'Success!',
        text: res.data.message || 'File uploaded successfully',
        timer: 2000,
        showConfirmButton: false
      });

      setFileError('');
    } catch (error) {
      console.error(error);
      setFileError('Error uploading file');


      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'There was an error uploading the file',
      });
    }
  };

  const onFileChange = (e) => {
    setCollegePicName(e.target.files[0].name);
    setselectedFile(e.target.files[0]);
    if (!selectedFile) {
      alert("image is selected");
      return false;
    }
  };

  const postData = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dataToPost = {
      ...userdata,
      universityDtoList: { universityId: userdata.universityId },
      createdBy: { userId: user.userId }
    };

    console.log(dataToPost);

    try {
      const response = await addCollege(dataToPost, headers);
      if (response.data.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
        FetchData();
      } else {
        alert(response.data.errorMessage || 'Failed to add college.');
      }
    } catch (error) { }
    setOpen(false);
    FetchData();
  };

  const handleEdit = async (collegeId) => {
    setEditMode(true);
    setOpen(true);
    try {
      const res = await fetchCollegeById(collegeId, headers);
      const det = res.data;
      console.log(det);

      setcollegeId(det.collegeId);

      setUserData({
        collegeName: det.collegeName,
        description: det.description,
        webUrl: det.webUrl,
        address: det.address,
        city: det.city,
        state: det.state,
        pincode: det.pincode,
        universityId: det.universityDtoList ? det.universityDtoList.universityId : ''
      });
    } catch (error) {
      console.error('Error fetching subject details:', error);
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
      collegeId: collegeId,
      collegeName: userdata.collegeName,
      collegePicName,
      description: userdata.description,
      webUrl: userdata.webUrl,
      address: userdata.address,
      city: userdata.city,
      state: userdata.state,
      pincode: userdata.pincode,
      universityDtoList: { universityId: userdata.universityId },
      updatedBy: { userId: user.userId }
    };
    console.log(updatedDataPayload);
    try {
      const response = await updatedCollege(updatedDataPayload, headers);
      if (response.data.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
        setEditMode(false);
        setcollegeId(null);
        setUserData({
          collegeName: '',
          description: '',
          webUrl: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          universityId: ''
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

  const handleDelete = async (collegeId) => {
    try {
      await deleteCollege(collegeId, headers);
      FetchData();
    } catch (error) {
      console.error('Error deleting college:', error);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>College</span>
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
                '&:hover': {
                  backgroundColor: "#03045E",
                  opacity: 0.9
                }
              }}
              onClick={handleAddCollege}
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
              {/* <TableBody>
                {courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.collegeId}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'actions' ? (
                          <>
                            <IconButton
                              sx={{ color: "#03045E" }}
                              onClick={() => {
                                handleEdit(row.collegeId);
                              }}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => {
                                handleDelete(row.collegeId);
                              }}
                            >
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

              <TableBody>
  {courses.length === 0 ? (
    <TableRow>
      <TableCell colSpan={columns.length} align="center">
        No courses found
      </TableCell>
    </TableRow>
  ) : (
    courses
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((row, index) => {
        // Debugging (optional)
        console.log(`Row ${index} - College ID:`, row.collegeId);

        return (
          <TableRow
            hover
            role="checkbox"
            tabIndex={-1}
            key={row.collegeId || `row-${index}`} // Fallback key if collegeId is missing
          >
            {columns.map((column) => (
              <TableCell key={`${row.collegeId}-${column.id}`} align={column.align}>
                {column.id === 'actions' ? (
                  <>
                    <IconButton
                      sx={{ color: "#03045E" }}
                      onClick={() => handleEdit(row.collegeId)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(row.collegeId)}
                    >
                      <DeleteForever />
                    </IconButton>
                  </>
                ) : (
                  row[column.id] || "—" // Fallback if data is missing
                )}
              </TableCell>
            ))}
          </TableRow>
        );
      })
  )}
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
        <CollegeCards
          colleges={courses}
          page={page}
          rowsPerPage={rowsPerPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" id="your-dialog-id">
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit College' : 'Add College'}</DialogTitle>
        <Box component="form" onSubmit={editMode ? updateData : postData} noValidate sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="College Name"
                name="collegeName"
                value={userdata.collegeName}
                onChange={changeHandler}
                error={!!errors.collegeName}
                helperText={errors.collegeName}
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
              <FormControl
                fullWidth
                error={!!errors.universityId}
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
              >
                <InputLabel>University</InputLabel>
                <Select
                  name="universityId"
                  value={userdata.universityId}
                  onChange={changeHandler}
                  label="University"
                >
                  {universities.map((university) => (
                    <MenuItem key={university.universityId} value={university.universityId}>
                      {university.universityName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.universityId && (
                  <Box component="span" sx={{ color: 'error.main', fontSize: '0.75rem', mt: 1 }}>
                    {errors.universityId}
                  </Box>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                id="collegePicName"
                label="File Name"
                name="collegePicName"
                autoComplete="collegePicName"
                value={userdata.collegePicName}
                disabled
                helperText={errors.collegePicName}
                error={!!errors.collegePicName}
                InputProps={{
                  endAdornment: (
                    <Button variant="contained" color="primary" onClick={onFileUpload} sx={{
                      backgroundColor: "#03045E",
                      '&:hover': {
                        backgroundColor: "#03045E",
                        opacity: 0.9
                      }
                    }}>
                      Upload
                    </Button>
                  )
                }}
              />
              <input type="file" onChange={onFileChange} ref={inputRef} style={{ marginTop: 20 }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="webUrl "
                name="webUrl"
                value={userdata.webUrl}
                onChange={changeHandler}
                error={!!errors.webUrl}
                helperText={errors.webUrl}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Address "
                name="address"
                value={userdata.address}
                onChange={changeHandler}
                error={!!errors.address}
                helperText={errors.address}
                multiline
                rows={2}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City "
                name="city"
                value={userdata.city}
                onChange={changeHandler}
                error={!!errors.city}
                helperText={errors.city}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State "
                name="state"
                value={userdata.state}
                onChange={changeHandler}
                error={!!errors.state}
                helperText={errors.state}
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
            <Grid item xs={12} md={6} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Pincode "
                name="pincode"
                value={userdata.pincode}
                onChange={changeHandler}
                error={!!errors.pincode}
                helperText={errors.pincode}
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
          <DialogActions>
            <Button onClick={() => setOpen(false)} sx={{ color: "#03045E" }}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" sx={{
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

export default College;
