import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import ChannelDetail from '../pages/ChannelDetail';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/channels/:id' element={<ChannelDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
