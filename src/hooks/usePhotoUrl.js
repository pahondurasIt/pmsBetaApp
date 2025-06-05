import avatar from '/user.png';

const useEmployeePhoto = () => {
  const getEmployeePhoto = (filename) => {
    if (!filename) return avatar;
    try {
      // Ruta para imágenes locales en public/EmpPht
      return `/EmpPht/${filename}`;
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
