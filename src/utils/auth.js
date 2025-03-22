export const getTeacherData = () => {
    const teacherStr = localStorage.getItem('teacherUser');
    if (!teacherStr) return null;
    
    try {
        const teacherData = JSON.parse(teacherStr);
        if (teacherData && teacherData.id && teacherData.token) {
            return teacherData;
        }
        return null;
    } catch (error) {
        console.error('Error parsing teacher data:', error);
        return null;
    }
};

export const checkTeacherAuth = () => {
    const teacherData = getTeacherData();
    return teacherData !== null;
};
