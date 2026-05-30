import jwt from 'jsonwebtoken'

/*
 Algumas rotas poderão ser acessadas sem token
*/

const bypassRoutes = [
  { url: '/users/login', method: 'POST' }
]

export default function(req, res, next) {

  /*
    Verifica se a rota pode ignorar autenticação
  */

  for(let route of bypassRoutes) {

    if(route.url === req.url &&
       route.method === req.method) {

      next()
      return
    }
  }

  /* PROCESSO DE VERIFICAÇÃO */

  let token

  // Procura token no cookie
  token = req.cookies[process.env.AUTH_COOKIE_NAME]

  if(! token) {

    // Procura token no header authorization
    const authHeader = req.headers['authorization']

    console.log({ authHeader })

    if(! authHeader) {
      console.error('ERRO DE AUTORIZAÇÃO: falta de cabeçalho')
      return res.status(403).end()
    }

    /*
      Formato:
      Bearer XXXXXXXXX
    */

    [, token] = authHeader.split(' ')
  }

  // Validação do token

  jwt.verify(token, process.env.TOKEN_SECRET,
    (error, user) => {

      if(error) {
        console.error('ERRO DE AUTORIZAÇÃO: token inválido')

        return res.status(403).end()
      }

      /*
        Guarda usuário autenticado
      */

      req.authUser = user

      next()
    }
  )
}