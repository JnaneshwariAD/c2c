// import React from 'react';
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   TablePagination,
//   Chip,
//   Box
// } from '@mui/material';

// const BatchCards = ({ 
//   batches, 
//   page, 
//   rowsPerPage, 
//   onEdit, 
//   onDelete, 
//   onPageChange, 
//   onRowsPerPageChange 
// }) => {
//   const count = batches.length;

//   return (
//     <>
//       <Grid container spacing={2}  textAlign={"center"}>
//         {batches
//           .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//           .map((batch) => (
//             <Grid item xs={12} sm={6} md={4} key={batch.batchId}>
//               <Card
//                 sx={{
//                   border: '1px solid #ddd',
//                   borderRadius: 2,
//                   transition: '0.3s',
//                   '&:hover': {
//                     boxShadow: 6,
//                     transform: 'translateY(-4px)',
//                   },
//                 }}
//               >
//                 <CardContent>
//                   <Typography
//                     variant="h3"
//                     align="center"
//                     sx={{ fontWeight: 'bold', mb: 1 }}
//                   >
//                     {batch.batchName}
//                   </Typography>
                  
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                     {batch.description}
//                   </Typography>
                  
//                   <Box sx={{ mb: 1 }}>
                    
//                     <Typography variant="body2">
//                      <strong>College:</strong>{" "} {batch.collegeName}
//                     </Typography>
//                   </Box>
//                   <Box sx={{ mb: 1 }}>
                    
//                     <Typography variant="body2">
//                      <strong>College:</strong>{" "} {batch.courseName}
//                     </Typography>
//                   </Box>


//                   <Grid container spacing={1} justifyContent="center">
//                     <Grid item>
//                       <Button 
//                         variant="outlined" 
//                         size="small" 
//                         onClick={() => onEdit(batch.batchId)}
//                       >
//                         View More
//                       </Button>
//                     </Grid>
//                      <Grid item>
//                       <Button 
//                         variant="outlined" 
//                         size="small" 
//                         onClick={() => onEdit(batch.batchId)}
//                       >
//                         Edit
//                       </Button>
//                     </Grid>
//                     <Grid item>
//                       <Button
//                         variant="outlined"
//                         color="error"
//                         size="small"
//                         onClick={() => onDelete(batch.batchId)}
//                       >
//                         Delete
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//       </Grid>
//       <TablePagination
//         rowsPerPageOptions={[10, 25, 100]}
//         component="div"
//         count={count}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={onPageChange}
//         onRowsPerPageChange={onRowsPerPageChange}
//       />
//     </>
//   );
// };

// export default BatchCards;

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TablePagination,
  Box
} from '@mui/material';

const BatchCards = ({ 
  batches, 
  page, 
  rowsPerPage, 
  onEdit, 
  onDelete, 
  onPageChange, 
  onRowsPerPageChange 
}) => {
  const count = batches.length;

  return (
    <>
      <Grid container spacing={2} textAlign={"center"}>
        {batches
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((batch) => (
            <Grid item xs={12} sm={6} md={4} key={batch.batchId}>
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
                    variant="h3"
                    align="center"
                    sx={{ fontWeight: 'bold', mb: 1 }}
                  >
                    {batch.batchName}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {batch.description}
                  </Typography>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2">
                     <strong>College:</strong>{" "} {batch.collegeName}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2">
                     <strong>Course:</strong>{" "} {batch.courseName}
                    </Typography>
                  </Box>

                  <Grid container spacing={1} justifyContent="center">
                    <Grid item>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => onEdit(batch.batchId)}
                      >
                        View More
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => onEdit(batch.batchId)}
                      >
                        Edit
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(batch.batchId)}
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

export default BatchCards;