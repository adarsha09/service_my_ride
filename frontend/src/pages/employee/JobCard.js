import React, { useState, useEffect } from "react";
import axios from "axios";
import EmployNavbar from "../../components/EmployNavbar";

const JobCard = () => {
    const [jobcardNo, setJobcardNo] = useState("");
    const [jobcardDetails, setJobcardDetails] = useState(null);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        description: "",
        grossTotal: "",
        gst: "18", // Default GST value
        netTotal: "",
        jobendingtime: "",
        noofhours: "",
    });

    const handleSearch = async () => {
        if (!jobcardNo) {
            alert("Please enter a job card number.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/api/search-jobcard", { jobcard_no: jobcardNo });
            setJobcardDetails(response.data.jobcard);
            setCustomerDetails(response.data.customerDetails);
        } catch (error) {
            console.error("Error fetching job card details:", error);
            alert(error.response?.data?.message || "Error fetching job card details.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ 
            ...prevData, 
            [name]: value 
        }));
    };

    // Calculate net total whenever gross total or GST changes
    useEffect(() => {
        if (formData.grossTotal || formData.gst) {
            calculateNetTotal();
        }
    }, [formData.grossTotal, formData.gst]);

    const calculateNetTotal = () => {
        const grossTotal = parseFloat(formData.grossTotal) || 0;
        const gst = parseFloat(formData.gst) || 0;
        const netTotal = grossTotal + (grossTotal * (gst / 100));
        setFormData((prevData) => ({ 
            ...prevData, 
            netTotal: netTotal.toFixed(2) 
        }));
    };

    const handleUpdate = async () => {
        const { description, grossTotal, gst, netTotal, jobendingtime, noofhours } = formData;

        if (!description || !grossTotal || !gst || !netTotal || !jobendingtime || !noofhours) {
            alert("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/api/update-jobcard", {
                jobcard_no: jobcardNo,
                description,
                grossTotal,
                gst,
                netTotal,
                jobendingtime,
                noofhours,
            });
            alert(response.data.message || "Job card updated successfully.");
            // Reset form after successful update
            setFormData({
                description: "",
                grossTotal: "",
                gst: "18",
                netTotal: "",
                jobendingtime: "",
                noofhours: "",
            });
            setJobcardDetails(null);
            setCustomerDetails(null);
            setJobcardNo("");
        } catch (error) {
            console.error("Error updating job card:", error);
            alert(error.response?.data?.error || "Error updating job card.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#eef27a" }}>
            <EmployNavbar />
            <div style={{ 
                marginLeft: "270px", 
                padding: "30px", 
                width: "100%",
                maxWidth: "1200px",
                marginLeft: "280px",
            }}>
                <div style={{
                     background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)"
,
  borderRadius: "16px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  padding: "40px"
                }}>
                    <h2 style={{ 
                        marginBottom: "25px", 
                        color: "#0056b3", 
                        borderBottom: "3px solid #0056b3", 
                        paddingBottom: "10px" 
                    }}>Job Card Management</h2>
                    
                    {/* Search Section */}
                    <div style={{ marginBottom: "30px" }}>
                        <label style={{ 
                            display: "block", 
                            marginBottom: "10px", 
                            fontWeight: "bold", 
                            color: "#444" 
                        }}>Search by Job Card Number:</label>
                        <div style={{ 
                            display: "flex", 
                            marginBottom: "20px",
                            gap: "10px"
                        }}>
                            <input
                                type="text"
                                value={jobcardNo}
                                onChange={(e) => setJobcardNo(e.target.value)}
                                placeholder="Enter Job Card Number"
                                style={{ 
                                    flex: "1",
                                    padding: "10px 15px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    fontSize: "16px"
                                }}
                            />
                            <button 
                                onClick={handleSearch} 
                                disabled={isLoading}
                                style={{ 
                                    padding: "10px 20px",
                                    backgroundColor: "#0056b3",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    transition: "background-color 0.3s"
                                }}
                            >
                                {isLoading ? "Searching..." : "Search"}
                            </button>
                        </div>
                    </div>

                    {jobcardDetails && (
                        <div>
                            {/* Job Card Details Section */}
                            <div style={{
                                display: "flex",
                                gap: "30px",
                                marginBottom: "30px",
                                flexWrap: "wrap"
                            }}>
                                <div style={{
                                    flex: "1",
                                    minWidth: "300px",
                                    backgroundColor: "#fafafa",
                                    padding: "20px",
                                    borderRadius: "6px",
                                    border: "1px solid #dee2e6"
                                }}>
                                    <h3 style={{ 
                                        color: "#0056b3", 
                                        marginBottom: "15px",
                                        fontSize: "18px"
                                    }}>Job Card Details</h3>
                                    <div style={{ marginBottom: "10px" }}>
                                        <span style={{ fontWeight: "bold" }}>Job Card Number:</span> {jobcardDetails.jobcard_no}
                                    </div>
                                    <div style={{ marginBottom: "10px" }}>
                                        <span style={{ fontWeight: "bold" }}>Vehicle Number:</span> {jobcardDetails.vehicle_number}
                                    </div>
                                    <div style={{ marginBottom: "10px" }}>
                                        <span style={{ fontWeight: "bold" }}>Job Starting Time:</span> {jobcardDetails.jobstartingtime}
                                    </div>
                                </div>

                                {customerDetails && customerDetails.length > 0 && (
                                    <div style={{
                                        flex: "1",
                                        minWidth: "300px",
                                        backgroundColor: "#f8f9fa",
                                        padding: "20px",
                                        borderRadius: "6px",
                                        border: "1px solid #dee2e6"
                                    }}>
                                        <h3 style={{ 
                                            color: "#0056b3", 
                                            marginBottom: "15px",
                                            fontSize: "18px"
                                        }}>Customer Details</h3>
                                        <div style={{ marginBottom: "10px" }}>
                                            <span style={{ fontWeight: "bold" }}>Name:</span> {customerDetails[0].customer_name}
                                        </div>
                                        <div style={{ marginBottom: "10px" }}>
                                            <span style={{ fontWeight: "bold" }}>Address:</span> {customerDetails[0].address}
                                        </div>
                                        <div style={{ marginBottom: "10px" }}>
                                            <span style={{ fontWeight: "bold" }}>Contact:</span> {customerDetails[0].contact_no}
                                        </div>
                                        <div style={{ marginBottom: "10px" }}>
                                            <span style={{ fontWeight: "bold" }}>Email:</span> {customerDetails[0].email_id}
                                        </div>
                                        <div style={{ marginBottom: "10px" }}>
                                            <span style={{ fontWeight: "bold" }}>Vehicle No:</span> {customerDetails[0].vehicle_no}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Job Card Update Form */}
                            <h3 style={{ 
                                color: "#0056b3", 
                                marginBottom: "20px",
                                borderBottom: "1px solid #dee2e6",
                                paddingBottom: "10px",
                                fontSize: "18px"
                            }}>Update Job Card</h3>
                            
                            <div style={{ 
                                display: "grid", 
                                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "20px",
                                marginBottom: "20px"
                            }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Ending Time:</label>
                                    <input
                                        type="time"
                                        name="jobendingtime"
                                        value={formData.jobendingtime}
                                        onChange={handleInputChange}
                                        required
                                        style={{ 
                                            width: "100%",
                                            padding: "10px",
                                            borderRadius: "4px",
                                            border: "1px solid #ccc"
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Number of Hours:</label>
                                    <input
                                        type="text"
                                        name="noofhours"
                                        value={formData.noofhours}
                                        onChange={handleInputChange}
                                        required
                                        style={{ 
                                            width: "100%",
                                            padding: "10px",
                                            borderRadius: "4px",
                                            border: "1px solid #ccc"
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Gross Total (₹):</label>
                                    <input
                                        type="text"
                                        name="grossTotal"
                                        value={formData.grossTotal}
                                        onChange={handleInputChange}
                                        required
                                        style={{ 
                                            width: "100%",
                                            padding: "10px",
                                            borderRadius: "4px",
                                            border: "1px solid #ccc"
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>GST (%):</label>
                                    <input
                                        type="text"
                                        name="gst"
                                        value={formData.gst}
                                        onChange={handleInputChange}
                                        required
                                        style={{ 
                                            width: "100%",
                                            padding: "10px",
                                            borderRadius: "4px",
                                            border: "1px solid #ccc"
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Net Total (₹):</label>
                                    <input
                                        type="text"
                                        name="netTotal"
                                        value={formData.netTotal}
                                        readOnly
                                        style={{ 
                                            width: "100%",
                                            padding: "10px",
                                            borderRadius: "4px",
                                            border: "1px solid #ccc",
                                            backgroundColor: "#f8f9fa"
                                        }}
                                    />
                                </div>
                            </div>
                            
                            {/* Description field */}
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Problem Description:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    required
                                    style={{ 
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                        resize: "vertical"
                                    }}
                                />
                            </div>
                            
                            {/* Submit button */}
                            <button 
                                onClick={handleUpdate} 
                                disabled={isLoading}
                                style={{ 
                                    padding: "12px 24px",
                                    backgroundColor: "red",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    marginTop: "10px"
                                }}
                            >
                                {isLoading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    )}
                    
                    {!jobcardDetails && !isLoading && jobcardNo && (
                        <div style={{
                            padding: "20px",
                            backgroundColor: "#f8d7da",
                            borderRadius: "4px",
                            color: "#721c24",
                            marginTop: "20px"
                        }}>
                            No job card found. Please check the job card number and try again.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobCard;