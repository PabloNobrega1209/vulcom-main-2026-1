async function handleLogoutButtonClick() {

  if(await askForConfirmation('Deseja realmente sair?')) {

    await myfetch.post('/users/logout')

    // window.localStorage.removeItem(
    //   import.meta.env.VITE_AUTH_TOKEN_NAME
    // )

    setAuthUser(null)

    navigate('/login')
  }
}