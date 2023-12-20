import React from 'react';
import { Link } from 'react-router-dom';
import { StackedCarouselSlideProps } from 'react-stacked-center-carousel';
import './Slide.css';

export const Slide = React.memo(function (StackedCarouselSlideProps) {
  const { data, dataIndex, isCenterSlide, swipeTo, slideIndex } =
    StackedCarouselSlideProps;

  const coverImage = data[dataIndex].thumbnailUrl;
  const text = data[dataIndex].title;
  const channelId = data[dataIndex].channelId;

  console.log(coverImage);
  return (
    <div className='card-card' draggable={false}>
      <Link
        to={`/channels/${channelId}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className={`cover fill ${isCenterSlide ? 'off' : 'on'}`}>
          <div
            className='card-overlay fill'
            onClick={() => {
              if (!isCenterSlide) swipeTo(slideIndex);
            }}
          />
        </div>
        <div className='detail fill'>
          <div className='discription'>
            <img
              style={{ width: 430 }}
              alt='j'
              className='cover-image'
              src={coverImage}
            />
            <p>{text}</p>
            <p>{channelId}</p>
          </div>
        </div>
      </Link>
    </div>
  );
});