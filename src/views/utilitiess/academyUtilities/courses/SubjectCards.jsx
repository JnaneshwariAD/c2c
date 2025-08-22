// src/views/Subject/SubjectCards.jsx
import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  CardActions,
  Button,
  TablePagination,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

const SubjectCards = ({
  subjects,
  onEdit,
  onDelete,
  onView,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  // Paginate subjects
  const paginatedSubjects = subjects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Grid container spacing={2} textAlign={"center"}>
        {paginatedSubjects.map((subject) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={subject.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {subject.subjectName || "Untitled Subject"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Course:</strong>{" "}
                  {subject.courseName || "No Course Info"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Semester:</strong>{" "}
                  {subject.semester || "No Semester Info"}
                </Typography>
                {/* <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {subject.description || "No description available."}
              </Typography> */}

                {/* File download */}
                {/* <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>File:</strong>{" "}
                {subject.fileUrl ? (
                  <a
                    href={subject.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                ) : (
                  "No File"
                )}
              </Typography> */}
                <Grid container spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                  <Grid item>
                    <Button variant="outlined" size="small" onClick={() => onEdit(subject)}>
                      ViewMore
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" size="small" onClick={() => onEdit(subject)}>
                      Edit
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => onDelete(subject.subjectId)}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>

              {/* <CardActions sx={{ justifyContent: "space-between" }}>
              <IconButton
                color="primary"
                  onClick={() => onEdit(subject)}
                size="small"
              >
                <Visibility />
              </IconButton>
              <IconButton
                color="secondary"
                onClick={() => onEdit(subject)}
                size="small"
              >
                <Edit />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => onDelete(subject.id)}
                size="small"
              >
                <Delete />
              </IconButton>
            </CardActions> */}
            </Card>
          </Grid>
        ))}
      </Grid>
      <TablePagination
        component="div"
        count={subjects.length}
        page={page}
        onPageChange={(e, newPage) => {
          if (typeof newPage === "number") {
            // Defensive: TablePagination sometimes passes event as first arg
            onPageChange && onPageChange(e, newPage);
          }
        }}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          onRowsPerPageChange && onRowsPerPageChange(e);
        }}
        rowsPerPageOptions={[10, 25, 100]}
      />
    </>
  );
};

export default SubjectCards;
