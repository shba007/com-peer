import JWT from "jsonwebtoken";

interface Token {
  id: string
}

export default defineEventHandler((event) => {
  try {
    // Access the authorirization token in header
    const config = useRuntimeConfig()
    let token = event.node.req.headers.authorization

    if (!token)
      throw Error('Token not found')

    token = token.split(" ")[1]
    try {
      const { id } = JWT.verify(token, config.private.authAccessSecret) as Token
      event.context.auth = { user: id }
    } catch (error) {
      throw Error('Invalid Token')
    }
  } catch (error: any) {
    console.warn((error as Error).message)
  }
})
