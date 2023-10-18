import { Route, Routes } from 'react-router-dom'

export const PrivateRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </>
  )
}
