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
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import { addTopic, deleteTopic, fetchAllModules, fetchTopicById, fetchTopics, updatedTopic } from 'views/API/kpscApi';
import { minWidth } from '@mui/system';

const columns = [
  { id: 'topicId', label: 'ID', align: 'center' },
  { id: 'topicName', label: 'Name', align: 'center' },
  { id: 'description', label: 'Description', minWidth: 100, align: 'center' },
  { id: 'moduleName', label: 'Modules', align: 'center' },
  { id: 'videoUrl', label: 'VideoUrl', minWidth: 400, align: 'center' },
  { id: 'createdBy', label: 'Created By', align: 'center' },
  { id: 'updatedBy', label: 'Updated By', align: 'center' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'center' },
  { id: 'updatedDate', label: 'Updated Date', align: 'center' },
  { id: 'actions', label: 'Actions', align: 'center' }
];

const UpSkillTopics = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [topics, setTopics] = useState([]);
  const [modules, setModules] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userdata, setUserData] = useState({
    topicName: '',
    description: '',
    moduleId: '',
    videoUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [topicId, setTopicId] = useState(null);

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
      const res = await fetchTopics(headers);
      const fetchedData = res.data.content;
      console.log(fetchedData);
      if (fetchedData) {
        const tableData = fetchedData.map((p) => ({
          topicId: p.topicId,
          topicName: p.topicName,
          description: p.description,
          moduleName: p.moduleDtoList ? p.moduleDtoList.moduleName : 'No Module Name',
          videoUrl: p.videoUrl,
          insertedDate: moment(p.insertedDate).format('L'),
          updatedDate: moment(p.updatedDate).format('L'),
          createdBy: p.createdBy ? p.createdBy.userName : 'No User',
          updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
        }));
        setTopics(tableData);
      } else {
        setTopics([]);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchModules = async () => {
    try {
      const res = await fetchAllModules(headers);
      const fetchedData = res.data.content;
      console.log(fetchedData);
      if (fetchedData) {
        const sortedData = fetchedData.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
        const moduleData = sortedData.map((c) => ({
          moduleId: c.moduleId,
          moduleName: c.moduleName
        }));
        setModules(moduleData);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchModules();
  }, [refreshTrigger]);

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.topicName || userdata.topicName.trim() === '') {
      newErrors.topicName = 'Enter the topic name';
    }

    if (!userdata.description || userdata.description.trim() === '') {
      newErrors.description = 'Enter the description';
    }
    if (!userdata.videoUrl || userdata.videoUrl.trim() === '') {
      newErrors.videoUrl = 'Enter the videoUrl';
    }

    if (!userdata.moduleId) {
      newErrors.moduleId = 'Select a module';
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

  const handleAddBanner = () => {
    setEditMode(false);
    setUserData({
      topicName: '',
      description: '',
      moduleId: '',
      videoUrl: ''
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
      topicName: userdata.topicName,
      description: userdata.description,
      videoUrl: userdata.videoUrl,
      moduleDtoList: { moduleId: userdata.moduleId },
      createdBy: { userId: user.userId }
    };

    console.log(dataToPost);

    try {
      const response = await addTopic(dataToPost, headers);
      if (response.data.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
        fetchData();
      } else {
        alert(response.data.errorMessage || 'Failed to add topic.');
      }
    } catch (error) {}
    setOpen(false);
    fetchData();
  };

  const handleEdit = async (topicId) => {
    setEditMode(true);
    setOpen(true);
    try {
      const res = await fetchTopicById(topicId, headers);
      const det = res.data;
      console.log(det);
      setTopicId(det.topicId);

      setUserData({
        topicName: det.topicName,
        description: det.description,
        videoUrl: det.videoUrl,
        moduleId: det.moduleDtoList ? det.moduleDtoList.moduleId : ''
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
      topicId: topicId,
      topicName: userdata.topicName,
      description: userdata.description,
      videoUrl: userdata.videoUrl,
      moduleDtoList: { moduleId: userdata.moduleId },
      updatedBy: { userId: user.userId }
    };
    try {
      const response = await updatedTopic(updatedDataPayload, headers);
      if (response.data.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
        setEditMode(false);
        setSubjectId(null);
        setUserData({
          topicName: '',
          description: '',
          videoUrl: '',
          moduleId: ''
        });
      } else {
        alert(response.data.errorMessage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      fetchData();
    }
  };

  const handleDelete = async (topicId) => {
    try {
      await deleteTopic(topicId, headers);
      fetchData();
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Topics</span>
          <Button
            variant="contained"
            color="primary"
            sx={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}
            onClick={handleAddBanner}
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
              {topics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.topicId}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'actions' ? (
                        <>
                          <IconButton color="primary" onClick={() => handleEdit(row.topicId)}>
                            <Edit />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(row.topicId)}>
                            <DeleteForever />
                          </IconButton>
                        </>
                      ) : (
                        row[column.id] || 'No Data'
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
          count={topics.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
        <Box component="form" noValidate sx={{ p: 3 }} onSubmit={editMode ? updateData : postData}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Topic Name"
                name="topicName"
                value={userdata.topicName}
                onChange={changeHandler}
                error={!!errors.topicName}
                helperText={errors.topicName}
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
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.moduleId}>
                <InputLabel id="module-select">Module</InputLabel>
                <Select labelId="module-select" name="moduleId" value={userdata.moduleId} onChange={changeHandler}>
                  {/* <MenuItem value="">
                    <em>None</em>
                  </MenuItem> */}
                  {modules.map((module) => (
                    <MenuItem key={module.moduleId} value={module.moduleId}>
                      {module.moduleName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.moduleId}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="VideoUrl "
                name="videoUrl"
                value={userdata.videoUrl}
                onChange={changeHandler}
                error={!!errors.videoUrl}
                helperText={errors.videoUrl}
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editMode ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </MainCard>
  );
};

export default UpSkillTopics;
