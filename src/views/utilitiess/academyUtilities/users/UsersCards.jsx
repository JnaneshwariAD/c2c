//  // UserCards.js
// import React from 'react';
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   TablePagination
// } from '@mui/material';

// const UsersCards = ({ users, page, rowsPerPage, onEdit, onDelete, onPageChange, onRowsPerPageChange }) => {
//   const count = users.length;

//   return (
//     <>
//       <Grid container spacing={2} mt={2}>
//         {users
//           .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//           .map((user) => (
//             <Grid item xs={12} sm={6} md={4} key={user.userId}>
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
//                     variant="h4"
//                     align="center"
//                     sx={{ fontWeight: 'bold', mb: 1 }}
//                   >
//                   User Name :  {user.userName}
//                   </Typography>
//                   <Typography variant="body2" align="center" color="text.secondary">
//                   Name :  {user.fullName}
//                   </Typography>
//                   {/* <Typography variant="body2" align="center" color="text.secondary">
//                     {user.email}
//                   </Typography> */}
//                   {/* <Typography variant="body2" align="center" color="text.secondary">
//                     {user.mobileNumber}
//                   </Typography> */}
//                   <Typography variant="h4" align="center" color="text.secondary">
//                     Role: {user.roleName}
//                   </Typography>
                  
//                   <Grid container spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                     
//                     <Grid item>
//                       <Button variant="outlined" size="small" onClick={() => onEdit(user.userId)}>
//                         View More
//                       </Button>
//                     </Grid>
//                      <Grid item>
//                       <Button variant="outlined" size="small" onClick={() => onEdit(user.userId)}>
//                         Edit
//                       </Button>
//                     </Grid>
//                     <Grid item>
//                       <Button
//                         variant="outlined"
//                         color="error"
//                         size="small"
//                         onClick={() => onDelete(user.userId)}
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

// export default UsersCards;

// UserCards.js
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TablePagination
} from '@mui/material';

const UsersCards = ({ users, page, rowsPerPage, onEdit, onDelete, onPageChange, onRowsPerPageChange }) => {
  const count = users.length;

  return (
    <>
      <Grid container spacing={2} mt={2}>
        {users
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((user, index) => (
            <Grid item xs={12} sm={6} md={4} key={user.userId}>
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
                    variant="h4"
                    align="center"
                    sx={{ fontWeight: 'bold', mb: 1 }}
                  >
                  User Name :  {user.userName}
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary">
                  Name :  {user.fullName}
                  </Typography>
                  <Typography variant="h4" align="center" color="text.secondary">
                    Role: {user.roleName}
                  </Typography>
                  
                  <Grid container spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                    <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(user.userId)}>
                        View More
                      </Button>
                    </Grid>
                     <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(user.userId)}>
                        Edit
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(user.userId)}
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

export default UsersCards;