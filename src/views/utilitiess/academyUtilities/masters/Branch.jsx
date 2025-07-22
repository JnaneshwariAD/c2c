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
  FormControl,
  Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import { addBranch, deleteBranch, fetchAllUniversities, fetchBranch, fetchBranchById, updatedBranch } from 'views/API/BranchApi';
import { BaseUrl } from 'BaseUrl';
import { useRef } from 'react';
import axios from 'axios';

const columns = [
  { id: 'branchId', label: 'ID', align: 'center' },
  { id: 'branchName', label: 'Name', align: 'center' },
  { id: 'description', label: 'Description', minWidth: 100, align: 'center' },
  { id: 'universityName', label: 'University', align: 'center' },
  { id: 'noOfSem', label: 'Sem', align: 'center' },
  { id: 'createdBy', label: 'Created By', align: 'center' },
  { id: 'updatedBy', label: 'Updated By', align: 'center' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'center' },
  { id: 'updatedDate', label: 'Updated Date', align: 'center' },
  { id: 'actions', label: 'Actions', align: 'center' }
];

const Branch = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [courses, setCourses] = useState([]);
  const [universities, setuniversities] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userdata, setUserData] = useState({
    branchName: '',
    description: '',
    noOfSem: ''
  });
  const [errors, setErrors] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [branchId, setbranchId] = useState(null);

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

  const FetchData = async () => {
    try {
      const res = await fetchBranch(headers);
      const fetchedData = res.data.content;
      console.log(fetchedData);

      if (fetchedData) {
        const tableData = fetchedData.map((p) => ({
          branchId: p.branchId,
          branchName: p.branchName,
          description: p.description,
          universityName: p.universityDtoList?.map((university) => university.universityName).join(', ') || 'No university',
          noOfSem: p.noOfSem,
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

    if (!userdata.branchName || userdata.branchName.trim() === '') {
      newErrors.branchName = 'Enter the branch name';
    }

    if (!userdata.description || userdata.description.trim() === '') {
      newErrors.description = 'Enter the description';
    }
    if (!userdata.noOfSem || isNaN(userdata.noOfSem)) {
      newErrors.noOfSem = 'Number of semesters is required and must be a valid number.';
    }

    if (!userdata.universityId) {
      newErrors.universityId = 'Select a univeristy';
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
      branchId: '',
      branchName: '',
      description: '',
      noOfSem: ''
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

    const dataToPost = {
      ...userdata,
      universityDtoList: userdata.universityId.map((id) => ({ universityId: id })),
      createdBy: { userId: user.userId }
    };

    console.log(dataToPost);

    try {
      const response = await addBranch(dataToPost, headers);
      if (response.data.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
        FetchData();
      } else {
        alert(response.data.errorMessage || 'Failed to add branch.');
      }
    } catch (error) { }
    setOpen(false);
    FetchData();
  };

  const handleEdit = async (branchId) => {
    setEditMode(true);
    setOpen(true);
    try {
      const res = await fetchBranchById(branchId, headers);
      const det = res.data;
      console.log(det);

      setbranchId(det.branchId);

      setUserData({
        branchName: det.branchName,
        description: det.description,
        noOfSem: det.noOfSem,
        universityId: det.universityDtoList ? det.universityDtoList.map((uni) => uni.universityId) : []
      });
    } catch (error) {
      console.error('Error fetching branch details:', error);
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
      branchId: branchId,
      branchName: userdata.branchName,
      description: userdata.description,
      noOfSem: userdata.noOfSem,
      universityDtoList: userdata.universityId.map((id) => ({ universityId: id })),
      updatedBy: { userId: user.userId }
    };

    console.log(updatedDataPayload);

    try {
      const response = await updatedBranch(updatedDataPayload, headers);
      console.log(response);
      if (response && response.data.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
        setEditMode(false);
        setbranchId(null);
        setUserData({
          branchName: '',
          description: '',
          noOfSem: '',
          universityDtoList: []
        });
      }
    } catch (error) {
      console.error('Error updating branch:', error);
    } finally {
      FetchData();
      setOpen(false);
    }
  };

  const handleDelete = async (branchId) => {
    try {
      await deleteBranch(branchId, headers);
      FetchData();
    } catch (error) {
      console.error('Error deleting branch:', error);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Branch</span>
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
                <TableRow hover role="checkbox" tabIndex={-1} key={row.branchId}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'actions' ? (
                        <>
                          <IconButton
                            sx={{ color: "#03045E" }}
                            onClick={() => {
                              handleEdit(row.branchId);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              handleDelete(row.branchId);
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
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Branch' : 'Add Branch'}</DialogTitle>
        <Box component="form" onSubmit={editMode ? updateData : postData} noValidate sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Branch Name"
                name="branchName"
                value={userdata.branchName}
                onChange={changeHandler}
                error={!!errors.branchName}
                helperText={errors.branchName}
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
              <FormControl fullWidth error={!!errors.universityId} sx={{
                '& .MuiOutlinedInput-root': {
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
                  value={userdata.universityId || []}
                  onChange={(e) =>
                    setUserData({
                      ...userdata,
                      universityId: e.target.value
                    })
                  }
                  multiple
                  renderValue={(selected) =>
                    universities
                      .filter((u) => selected.includes(u.universityId))
                      .map((u) => u.universityName)
                      .join(', ') || 'Select Universities'
                  }
                >
                  {universities.map((university) => (
                    <MenuItem key={university.universityId} value={university.universityId}>
                      <Checkbox checked={userdata.universityId?.includes(university.universityId)} />
                      {university.universityName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.universityId && <Box sx={{ color: 'red', fontSize: '0.75rem', mt: 1 }}>{errors.universityId}</Box>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sem"
                name="noOfSem"
                value={userdata.noOfSem}
                onChange={changeHandler}
                error={!!errors.noOfSem}
                helperText={errors.noOfSem}
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

export default Branch;
