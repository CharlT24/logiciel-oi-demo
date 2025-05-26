// pages/admin/utilisateurs.js
export async function getServerSideProps() {
    return {
      redirect: {
        destination: "/admin/parametres/utilisateurs",
        permanent: true,
      },
    }
  }
  
  export default function RedirectPage() {
    return null
  }
  