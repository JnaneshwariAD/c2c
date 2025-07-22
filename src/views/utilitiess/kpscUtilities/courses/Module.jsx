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
  IconButton,
  Checkbox,
  FormHelperText,
  ListItemText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import { fetchModules, fetchAllSubjects, addModule, fetchModuleById, updatedModule, deleteModule } from 'views/API/kpscApi';

const columns = [
  { id: 'moduleId', label: 'ID', align: 'center' },
  { id: 'moduleName', label: 'Name', align: 'center' },
  { id: 'description', label: 'Description', minWidth: 150, align: 'center' },
  { id: 'subjectName', label: 'Subjects', align: 'center' },
  { id: 'createdBy', label: 'Created By', align: 'center' },
  { id: 'updatedBy', label: 'Updated By', align: 'center' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'center' },
  { id: 'updatedDate', label: 'Updated Date', align: 'center' },
  { id: 'actions', label: 'Actions', align: 'center' }
];

const UpSkillModules = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [subjects, setSubjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userdata, setUserData] = useState({
    moduleName: '',
    description: '',
    courseId: [],
  subjectId: [], // <- Add this
  videoUrl: '',
  semester: [],
  url: '',
  fileName: '',
  filePath: null
  });

  const [errors, setErrors] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [moduleId, setModuletId] = useState(null);

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
      const res = await fetchModules(headers);
      const fetchedData = res.data.content || [];
      const tableData = fetchedData.map((p) => ({
        moduleId: p.moduleId,
        moduleName: p.moduleName,
        description: p.description,
        subjectName: p.subjectDtoList?.map((sub) => sub.subjectName).join(', ') || 'No subject',
        insertedDate: moment(p.insertedDate).format('L'),
        updatedDate: moment(p.updatedDate).format('L'),
        createdBy: p.createdBy ? p.createdBy.userName : 'No User',
        updatedBy: p.updatedBy ? p.updatedBy.userName : 'No User'
      }));
      setModules(tableData);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetchAllSubjects(headers);
      const fetchedData = res.data || [];
      const sortedData = fetchedData.sort((a, b) => a.subjectName.localeCompare(b.subjectName));
      setSubjects(sortedData);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSubjects();
  }, [refreshTrigger]);

  const validateForm = () => {
    const newErrors = {};
    if (!userdata.moduleName.trim()) {
      newErrors.moduleName = 'Enter the module name';
    }
    if (!userdata.description.trim()) {
      newErrors.description = 'Enter the description';
    }
    if (selectedSubjects.length === 0) {
      newErrors.subjectId = 'Select at least one subject';
    }
    return newErrors;
  };

  const changeHandler = (e) => {
    if (e.target.name === 'subjectId') {
      setSelectedSubjects(e.target.value);
    } else {
      setUserData({
        ...userdata,
        [e.target.name]: e.target.value
      });
    }
    setErrors({
      ...errors,
      [e.target.name]: null
    });
  };

  const handleAddModule = () => {
    setEditMode(false);
    setUserData({
      moduleName: '',
      description: ''
    });
    setSelectedSubjects([]);
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
      moduleName: userdata.moduleName,
      description: userdata.description,
      subjectDtoList: selectedSubjects.map((subjectId) => ({ subjectId })),
      createdBy: { userId: user.userId }
    };

    try {
      const response = await addModule(dataToPost, headers);
      if (response.data.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
        // Optionally reset form fields
        setUserData({ moduleName: '', description: '' });
        setSelectedSubjects([]);
      } else {
        alert(response.data.errorMessage || 'Failed to add module.');
      }
    } catch (error) {
      console.error('Error adding module:', error);
    }
  };

  const handleEdit = async (moduleId) => {
    setEditMode(true);
    setOpen(true);
    try {
      const res = await fetchModuleById(moduleId, headers);
      const det = res.data;
      setModuletId(det.moduleId);
      const selectedModule = det.subjectDtoList ? det.subjectDtoList.map((sub) => sub.subjectId) : [];
      setSelectedSubjects(selectedModule);

      setUserData({
        moduleName: det.moduleName,
        description: det.description
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
      moduleId: moduleId,
      moduleName: userdata.moduleName,
      description: userdata.description,
      subjectDtoList: selectedSubjects.map((subjectId) => ({ subjectId })),
      updatedBy: { userId: user.userId }
    };

    try {
      const response = await updatedModule(updatedDataPayload, headers);
      if (response.data.responseCode === 201) {
        setRefreshTrigger(!refreshTrigger);
        setOpen(false);
        setEditMode(false);
        setModuletId(null);
        setUserData({
          moduleName: '',
          description: ''
        });
        setSelectedSubjects([]);
      } else {
        alert(response.data.errorMessage);
      }
    } catch (error) {
    } finally {
      fetchData();
    }
  };

  const handleDelete = async (moduleId) => {
    try {
      await deleteModule(moduleId, headers);
      fetchData();
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Modules</span>
          <Button
            variant="contained"
            color="primary"
            sx={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}
            onClick={handleAddModule}
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
              {modules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.moduleId}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'actions' ? (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              handleEdit(row.moduleId);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              handleDelete(row.moduleId);
                            }}
                          >
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
          count={modules.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog 
  open={open} 
  onClose={() => setOpen(false)} 
  fullWidth 
  maxWidth="md"
  // Optional: Add if nested in another modal
  // disableEnforceFocus  
>
  <DialogTitle sx={{ fontSize: '16px' }}>
    {editMode ? 'Edit Module' : 'Add Module'}
  </DialogTitle>
  <Box 
    component="form" 
    onSubmit={editMode ? updateData : postData} 
    noValidate 
    sx={{ p: 3 }}
  >
    {/* Form fields (no changes needed) */}
    <DialogActions>
      <Button onClick={() => setOpen(false)} color="primary">
        Cancel
      </Button>
      <Button type="submit" variant="contained" color="primary">
        {editMode ? 'Update' : 'Save'}
      </Button>
    </DialogActions>
  </Box>
</Dialog>
      <Dialog open={open} 
      
      onClose={() => setOpen(false)} 
      fullWidth 
      maxWidth="md"
      disableEnforceFocus
      >
        <DialogTitle sx={{ fontSize: '16px' }}>{editMode ? 'Edit Module' : 'Add Module'}</DialogTitle>
        <Box component="form" onSubmit={editMode ? updateData : postData} noValidate sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Module Name"
                name="moduleName"
                value={userdata.moduleName}
                onChange={changeHandler}
                error={!!errors.moduleName}
                helperText={errors.moduleName}
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
              <FormControl fullWidth error={!!errors.subjectId}>
                <InputLabel>Subjects</InputLabel>
                {/* <Select
                  multiple
                  name="subjectId"
                  value={selectedSubjects}
                  onChange={changeHandler}
                  renderValue={(selected) => selected.map((id) => subjects.find((s) => s.subjectId === id)?.subjectName).join(', ')}
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject.subjectId} value={subject.subjectId}>
                      <Checkbox checked={selectedSubjects.indexOf(subject.subjectId) > -1} />
                     <Checkbox checked={(userdata.courseId ?? []).includes(course.courseId)} />
<Checkbox checked={(userdata.subjectId ?? []).includes(subject.subjectId)} />

                      <ListItemText primary={subject.subjectName} />
                    </MenuItem>
                  ))}
                </Select> */}
                <Select
  multiple
  name="subjectId"
  value={selectedSubjects}
  onChange={changeHandler}
  renderValue={(selected) => selected.map((id) => subjects.find((s) => s.subjectId === id)?.subjectName).join(', ')}
>
  {subjects.map((subject) => (
    <MenuItem key={subject.subjectId} value={subject.subjectId}>
      <Checkbox checked={selectedSubjects.includes(subject.subjectId)} />
      <ListItemText primary={subject.subjectName} />
    </MenuItem>
  ))}
</Select>
                <FormHelperText>{errors.subjectId}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editMode ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </MainCard>
  );
};

export default UpSkillModules;
