import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import EmployNavbar from "../../components/EmployNavbar";

const ViewFeedback = () => {
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        fetchFeedback();
    }, []);

    const formatFeedbackDates = (feedbackData) => {
        return feedbackData.map(item => ({
            ...item,
            created_at: new Date(item.created_at).toLocaleDateString('en-GB') // Format as DD/MM/YYYY
        }));
    };

    const fetchFeedback = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/feedback');
            const formattedFeedback = formatFeedbackDates(response.data);
            setFeedback(formattedFeedback);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 50 },
        { field: "name", headerName: "Name", width: 200 },
        { field: "email", headerName: "Email", width: 250 },
        { field: "feedback", headerName: "Feedbacks", width: 300 },
        { field: "created_at", headerName: "Created On", width: 200 },
    ];

    return (
          <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #b277e7 30%, #ff6a00 130%)' }}>
            <EmployNavbar />
            <div style={{ marginLeft: "270px", padding: "24px", width: "100%" }}>
                  <h2 style={{ fontWeight: 600, marginBottom: '16px', color: '#37474f' }}>View Feedbacks</h2>
                <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                        rows={feedback}
                        columns={columns}
                        pageSize={5}
                        getRowId={(row) => row.id}
                        sx={{
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#fbc02d',   // golden yellow like Manage Vehicle
    color: '#000',                // black text for visibility
    fontWeight: 'bold',
    fontSize: '1rem',
    textAlign: 'center',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 'bold',
    color: '#000',
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: '#d799cf', // lighter yellow on hover
    transform: 'scale(1.01)',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 0 12px rgba(220, 100, 45, 0.6)',
  },
  '& .MuiDataGrid-cell': {
    fontSize: '0.95rem',
    color: '#000000',
  },
}}
                    />
                </div>
            </div>
        </div>
    );
};

export default ViewFeedback;
