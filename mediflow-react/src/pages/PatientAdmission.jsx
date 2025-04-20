// In PatientAdmission.jsx, update the loadData function
const loadData = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Use Promise.allSettled instead of Promise.all to prevent one failed request from failing all
    const [admissionsResult, patientsResult, bedsResult] = await Promise.allSettled([
      fetchActiveAdmissions(),
      fetchPatients(),
      fetchAvailableBeds()
    ]);
    
    // Extract values or empty arrays if rejected
    const admissionsData = admissionsResult.status === 'fulfilled' ? admissionsResult.value : [];
    const patientsData = patientsResult.status === 'fulfilled' ? patientsResult.value : [];
    const bedsData = bedsResult.status === 'fulfilled' ? bedsResult.value : [];
    
    setAdmissions(admissionsData);
    setPatients(patientsData);
    setAvailableBeds(bedsData);
    
    // Show warning if any request failed
    if (admissionsResult.status === 'rejected' || 
        patientsResult.status === 'rejected' || 
        bedsResult.status === 'rejected') {
      setError('Some data could not be loaded. Please refresh to try again.');
    }
    
    setLoading(false);
  } catch (error) {
    console.error('Error loading admission data:', error);
    setError('Failed to load admission data. Please try again.');
    setLoading(false);
  }
};
