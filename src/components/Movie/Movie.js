import React from 'react';
import propTypes from 'prop-types';
import { Card, Space, Typography, Image, Button, Rate, Row, Spin } from 'antd';
import { format, parse } from 'date-fns';
const { Title, Text } = Typography;

import './movie.css';

export default class Movie extends React.Component {
  static propTypes = {
    picture: propTypes.node,
    title: propTypes.string,
    date: propTypes.node,
    genres: propTypes.arrayOf(propTypes.number),
    description: propTypes.string,
    handleRatingChange: propTypes.func,
    rating: propTypes.node,
    id: propTypes.number,
    genresList: propTypes.arrayOf(propTypes.object),
  };
  state = {
    ratedValue: 0,
  };
  setRatedValue = (value) => {
    this.setState({
      ratedValue: value,
    });
  };
  descGenres = (genres, genresList) => {
    return genres
      .map((g) => {
        let genrArr = [];
        genresList.forEach((a) => {
          if (g === a.id) {
            genrArr.push(a.name);
          }
        });
        return (
          <span className="genres" key={g}>
            <Button>{genrArr}</Button>
          </span>
        );
      })
      .slice(0, 3);
  };
  descOverview = (arr, num) => {
    let arrSplit = arr.split(' ');
    let newArrLength = 0;
    let newArr = [];
    for (let i = 0; i < arrSplit.length; i++) {
      if (num > newArrLength) {
        newArrLength += arrSplit[i].length + 1;
        newArr.push(arrSplit[i]);
      }
    }
    return newArr.join(' ') + ' ...';
  };
  getStarRating = (rating, id) => {
    if (rating) {
      return rating;
    }
    try {
      if (JSON.parse(localStorage.getItem('ratedFilms'))[id]) {
        return JSON.parse(localStorage.getItem('ratedFilms'))[id];
      }
    } catch {
      return 0;
    }
  };
  render() {
    const { picture, title, date, genres, description, handleRatingChange, rating, id, genresList } = this.props;
    const { ratedValue } = this.state;
    let color = '';
    if (ratedValue >= 0 && ratedValue <= 3) {
      color = '#E90000';
    } else if (ratedValue > 3 && ratedValue <= 5) {
      color = '#E97E00';
    } else if (ratedValue > 5 && ratedValue <= 7) {
      color = '#E9D100';
    } else {
      color = '#66E900';
    }
    return (
      <Card className="card">
        <Image
          className="image"
          src={
            picture
              ? 'https://image.tmdb.org/t/p/original/' + picture
              : 'data:image/png;base64,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'
          }
          placeholder={
            <Spin size="large">
              <div className="placeholder"></div>
            </Spin>
          }
          alt={title}
        />
        <Card.Grid className="gridStyle">
          <Space direction="vertical">
            <Row justify={'space-between'} className="row">
              <Title className="title" level={2}>
                {title.length > 20 ? this.descOverview(title, 13) : title}
              </Title>
              <Text
                className="rated"
                style={{
                  border: `solid 3px ${color}`,
                }}
              >
                {ratedValue}
              </Text>
            </Row>
            <Text className="date" type="secondary">
              {date ? format(parse(date, 'yyyy-MM-dd', new Date()), 'MMMM dd, yyyy') : null}
            </Text>
            <div className="genres__list">{this.descGenres(genres, genresList)}</div>
            <Text className="description">
              {description.length > 120 ? this.descOverview(description, 240) : description}
            </Text>
            <Rate
              className="rate"
              onChange={(value) => {
                handleRatingChange(value);
                this.setRatedValue(value);
              }}
              count={10}
              allowHalf
              defaultValue={ratedValue}
              value={this.getStarRating(rating ? rating : null, id)}
            />
          </Space>
        </Card.Grid>
      </Card>
    );
  }
}
