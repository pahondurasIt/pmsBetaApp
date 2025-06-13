import avatar from '/user.png';

const useEmployeePhoto = () => {
  const getEmployeePhoto = (filename) => {
    if (!filename) return avatar;
    try {
      // Ruta para imágenes locales en public/EmpPht
      return `${import.meta.env.VITE_API_URL}/EmpPht/${filename}.jpg`;
      // // Ruta para imágenes locales en src/assets/EmpPht
      // return new URL(`/EmpPht/${filename}`, import.meta.url).href;
    } catch (error) {
      console.warn('Imagen de empleado no encontrada:', filename);
      return avatar;
    }
  };

  return { getEmployeePhoto };
};

export default useEmployeePhoto;
