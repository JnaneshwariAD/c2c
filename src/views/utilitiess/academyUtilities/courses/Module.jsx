// src/views/Module/Modules.jsx
import * as React from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, IconButton, FormControl, InputLabel, MenuItem,
  FormHelperText, Select, ToggleButtonGroup, ToggleButton, CircularProgress, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit, ViewList, ViewModule } from '@mui/icons-material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import MainCard from 'ui-component/cards/MainCard';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import {
  fetchModules,
  fetchModuleById,
  addModule,
  updatedModule,
  deleteModule
} from 'views/API/ModuleApi';
import { fetchAllSubjects } from 'views/API/SubjectApi';
import { BaseUrl } from 'BaseUrl';
import axios from 'axios';
import Swal from 'sweetalert2';

const columns = [
  { id: 'displayId', label: 'ID', minWidth: 50 },
  { id: 'moduleName', label: 'Name', minWidth: 150 },
  { id: 'description', label: 'Description', minWidth: 350 },
  { id: 'subjectName', label: 'Subject', minWidth: 150 },
  { id: 'file', label: 'Upload Syllabus', minWidth: 180 },
  { id: 'createdBy', label: 'Created By', align: 'right' },
  { id: 'updatedBy', label: 'Updated By', align: 'right' },
  { id: 'insertedDate', label: 'Inserted Date', align: 'right' },
  { id: 'updatedDate', label: 'Updated Date', align: 'right' },
  { id: 'actions', label: 'Actions', align: 'right' }
];

const Modules = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [subjects, setSubjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(false);
  const [moduleId, setModuleId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [userdata, setUserData] = useState({
    moduleName: '',
    description: '',
    subjectId: '',
    fileName: '',
    filePath: ''
  });

  const [errors, setErrors] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + (user?.accessToken || '')
  };

  const fileDownloadBase = `${BaseUrl}/file/downloadFile/?filePath=`;

  // ---------- Helpers ----------
  const safeList = (res) => {
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.content)) return res.data.content;
    if (Array.isArray(res?.data?.data)) return res.data.data;
    return [];
  };

  const getSubjectName = (m) => {
    if (Array.isArray(m.subjectDtoList) && m.subjectDtoList.length) {
      return m.subjectDtoList[0]?.subjectName || 'No Subject';
    }
    if (m.subjectDtoList && typeof m.subjectDtoList === 'object') {
      return m.subjectDtoList.subjectName || 'No Subject';
    }
    return 'No Subject';
  };

  // ---------- Fetch ----------
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetchModules(headers);
      const list = safeList(res);
      const sorted = [...list].sort((a, b) => a.moduleId - b.moduleId);
      const tableData = sorted.map((m, idx) => ({
        displayId: idx + 1,
        moduleId: m.moduleId,
        moduleName: m.moduleName,
        description: m.description,
        subjectName: getSubjectName(m),
        subjectId:
          Array.isArray(m.subjectDtoList) ? (m.subjectDtoList[0]?.subjectId || '') :
          (m.subjectDtoList?.subjectId || ''),
        fileName: m.fileName,
        filePath: m.filePath,
        insertedDate: m.insertedDate ? moment(m.insertedDate).format('L') : '',
        updatedDate: m.updatedDate ? moment(m.updatedDate).format('L') : '',
        createdBy: m.createdBy?.userName || 'No User',
        updatedBy: m.updatedBy?.userName || 'No User'
      }));
      setModules(tableData);
    } catch (err) {
      console.error('Error fetching modules:', err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load modules', confirmButtonColor: theme.palette.primary.main });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetchAllSubjects(headers);
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
      const sorted = [...list].sort((a, b) => a.subjectName.localeCompare(b.subjectName));
      setSubjects(sorted.map(s => ({ subjectId: s.subjectId, subjectName: s.subjectName })));
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // ---------- Validation ----------
  const validateForm = () => {
    const newErrors = {};
    if (!userdata.moduleName?.trim()) newErrors.moduleName = 'Enter the module name';
    if (!userdata.description?.trim()) newErrors.description = 'Enter the description';
    if (!userdata.subjectId) newErrors.subjectId = 'Select a subject';
    if (!editMode && !userdata.filePath && !selectedFile) newErrors.file = 'Please upload a PDF';
    return newErrors;
  };

  // ---------- Handlers ----------
  const changeHandler = (e) => {
    setUserData({ ...userdata, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleAddModule = () => {
    setEditMode(false);
    setUserData({
      moduleName: '',
      description: '',
      subjectId: '',
      fileName: '',
      filePath: ''
    });
    setSelectedFile(null);
    setErrors({});
    setOpen(true);
  };

  const handleEdit = async (row) => {
    setEditMode(true);
    setOpen(true);
    setModuleId(row.moduleId);

    // Prefill immediately from row
    setUserData({
      moduleName: row.moduleName,
      description: row.description,
      subjectId: row.subjectId || '',
      fileName: row.fileName || '',
      filePath: row.filePath || ''
    });

    try {
      const res = await fetchModuleById(row.moduleId, headers);
      const det = res.data;
      setUserData({
        moduleName: det.moduleName || row.moduleName,
        description: det.description || row.description,
        subjectId:
          Array.isArray(det.subjectDtoList) ? (det.subjectDtoList[0]?.subjectId || '') :
          (det.subjectDtoList?.subjectId || row.subjectId || ''),
        fileName: det.fileName || row.fileName || '',
        filePath: det.filePath || row.filePath || ''
      });
    } catch (err) {
      console.error('Error fetching module by id:', err);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#03045E',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;

    try {
      await deleteModule(id, headers);
      setRefreshTrigger(v => !v);
    } catch (err) {
      console.error('Delete failed:', err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Delete failed', confirmButtonColor: theme.palette.primary.main });
    }
  };

  // File handling
  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setErrors(prev => ({ ...prev, file: 'Only PDF files are allowed' }));
      return;
    }
    setSelectedFile(f);
    setErrors(prev => ({ ...prev, file: null }));
    setUserData(prev => ({ ...prev, fileName: f.name }));
  };

  const uploadFile = async () => {
    if (!selectedFile) return null;
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const res = await axios.post(`${BaseUrl}/file/uploadFile`, formData, {
        headers: {
          Authorization: 'Bearer ' + (user?.accessToken || '')
        }
      });
      return {
        fileName: res.data.fileName || selectedFile.name,
        filePath: res.data.filePath || res.data.fileDownloadUri || ''
      };
    } catch (err) {
      console.error('File upload failed:', err);
      Swal.fire({ icon: 'error', title: 'Upload failed', text: 'Please try again', confirmButtonColor: theme.palette.primary.main });
      return null;
    }
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    let uploaded = null;
    if (selectedFile) {
      uploaded = await uploadFile();
      if (!uploaded) return;
    }

    const payload = {
      moduleName: userdata.moduleName,
      description: userdata.description,
 subjectDtoList: userdata.subjectId
      ? [{
          subjectId: userdata.subjectId,
          subjectName: subjects.find(s => s.subjectId === userdata.subjectId)?.subjectName || ""
        }]
      : [],
            fileName: uploaded?.fileName || userdata.fileName || '',
      filePath: uploaded?.filePath || userdata.filePath || ''
    };

    try {
      let res;
      if (editMode) {
        res = await updatedModule(moduleId, payload, headers);
      } else {
        res = await addModule(payload, headers);
      }

      const code = res?.data?.responseCode;
      if (code === 200 || code === 201) {
        setRefreshTrigger(v => !v);
        setOpen(false);
        setEditMode(false);
        setModuleId(null);
        setSelectedFile(null);
        Swal.fire({ icon: 'success', title: 'Success', text: res?.data?.message || 'Operation successful', confirmButtonColor: '#03045E' });
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res?.data?.errorMessage || 'Operation failed' });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: err?.response?.data?.errorMessage || err.message || 'Something went wrong' });
    }
  };

  // ---------- UI ----------
  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Modules</span>
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
              sx={{ backgroundColor: '#03045E', '&:hover': { opacity: 0.9 } }}
              onClick={handleAddModule}
            >
              Add <AddIcon sx={{ color: '#fff', ml: 0.5 }} />
            </Button>
          </Box>
        </Box>
      }
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : viewMode === 'list' ? (
        <Paper>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((c) => (
                    <TableCell key={c.id} align={c.align} style={{ minWidth: c.minWidth }}>{c.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {modules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow hover key={row.moduleId}>
                    {columns.map((c) => (
                      <TableCell key={c.id} align={c.align}>
                        {c.id === 'actions' ? (
                          <>
                            <IconButton color="primary" onClick={() => handleEdit(row)}>
                              <Edit />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(row.moduleId)}>
                              <DeleteForever />
                            </IconButton>
                          </>
                        ) : c.id === 'file' ? (
                          row.filePath ? (
                            // <a
                            //   href={fileDownloadBase + row.filePath}
                            //   target="_blank"
                            //   rel="noreferrer"
                            //   style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#03045E' }}
                            // >
                            //   <PictureAsPdfIcon sx={{ color: 'red', mr: 1 }} />
                            //   <Typography component="span" variant="body2" maxWidth={150}   noWrap>
                            //     {row.fileName || 'View PDF'}
                            //   </Typography>
                            // </a>
                            <a
  href={`https://docs.google.com/viewer?url=${encodeURIComponent(fileDownloadBase + row.filePath)}&embedded=true`}
  target="_blank"
  rel="noreferrer"
  style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#03045E' }}
>
  <PictureAsPdfIcon sx={{ color: 'red', mr: 1 }} />
  <Typography component="span" variant="body2" noWrap sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
    {row.fileName || 'View PDF'}
  </Typography>
</a>

                          ) : (
                            <Typography variant="body2" color="text.secondary">No file</Typography>
                          )
                        ) : c.id === 'description' ? (
                          <div style={{ textAlign: 'justify', whiteSpace: 'pre-line' }}>{row.description}</div>
                        ) : (
                          row[c.id] || ''
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {modules.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={modules.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
          />
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {modules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((m) => (
            <Grid item xs={12} sm={6} md={4} key={m.moduleId}>
              <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>{m.moduleName}</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>
                  {m.description}
                </Typography>
                <Box mt={1}>
                  <Typography variant="caption" color="text.secondary">
                    Subject: {m.subjectName}
                  </Typography>
                </Box>
                {m.filePath && (
                  <Box mt={1} display="flex" alignItems="center">
                    <PictureAsPdfIcon sx={{ color: 'red', mr: 1 }} />
                    <a
                      href={fileDownloadBase + m.filePath}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: 'none', color: '#03045E' }}
                    >
                      <Typography component="span" variant="body2">{m.fileName || 'View PDF'}</Typography>
                    </a>
                  </Box>
                )}
                <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                  <IconButton color="primary" onClick={() => handleEdit(m)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(m.moduleId)}>
                    <DeleteForever />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
          {modules.length === 0 && (
            <Grid item xs={12}><Typography align="center">No modules</Typography></Grid>
          )}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditMode(false);
          setSelectedFile(null);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editMode ? 'Edit Module' : 'Add Module'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Module Name"
            name="moduleName"
            value={userdata.moduleName}
            onChange={changeHandler}
            error={!!errors.moduleName}
            helperText={errors.moduleName}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={userdata.description}
            onChange={changeHandler}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            multiline
            rows={3}
          />
          <FormControl fullWidth margin="dense" error={!!errors.subjectId}>
            <InputLabel>Subject</InputLabel>
            <Select
              name="subjectId"
              value={userdata.subjectId}
              label="Subject"
              onChange={changeHandler}
            >
              {subjects.map(s => (
                <MenuItem key={s.subjectId} value={s.subjectId}>{s.subjectName}</MenuItem>
              ))}
            </Select>
            {errors.subjectId && <FormHelperText>{errors.subjectId}</FormHelperText>}
          </FormControl>

          <Box mt={2} display="flex" alignItems="center" gap={2}>
            <Button variant="outlined" component="label">
              Upload PDF
              <input
                type="file"
                hidden
                accept="application/pdf"
                onChange={onFileChange}
              />
            </Button>

            {/* Selected file (new) */}
            {selectedFile ? (
              <Box display="flex" alignItems="center" gap={1}>
                <PictureAsPdfIcon sx={{ color: 'red' }} />
                <Typography variant="body2">{selectedFile.name}</Typography>
              </Box>
            ) : userdata.fileName ? (
              // Existing file (when editing)
              <Box display="flex" alignItems="center" gap={1}>
                <PictureAsPdfIcon sx={{ color: 'red' }} />
                <a
                  href={userdata.filePath ? (fileDownloadBase + userdata.filePath) : '#'}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none', color: '#03045E' }}
                >
                  <Typography variant="body2">Current: {userdata.fileName}</Typography>
                </a>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No file selected</Typography>
            )}
          </Box>

          {errors.file && <Typography variant="caption" color="error">{errors.file}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpen(false);
            setEditMode(false);
            setSelectedFile(null);
          }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editMode ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default Modules;
