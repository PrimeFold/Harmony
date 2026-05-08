import { SignJWT, jwtVerify } from "jose";


const secret = new TextEncoder().encode(
  process.env.JWT_SECRET 
);

const refreshSecret = new TextEncoder().encode(
    process.env.JWT_REFRESH_SECRET
)

export const signRefreshToken = async (payload: { userId: string }) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(refreshSecret);
};
export const signAccessToken = async (payload: { userId: string }) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") 
    .sign(secret);
};

export const verifyAccessToken = async (token: string) => {

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string };
  } catch (error) {
    return null;
  }
};


export const verifyRefreshToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, refreshSecret)
    return payload as { userId: string; type: string }
  } catch (error) {
    return null
  }
}


