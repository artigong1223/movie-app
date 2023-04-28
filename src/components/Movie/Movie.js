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
  render() {
    const { picture, title, date, genres, description, handleRatingChange, rating, genresList, votes } = this.props;
    const { ratedValue } = this.state;
    let color = '';
    if (votes >= 0 && votes <= 3) {
      color = '#E90000';
    } else if (votes > 3 && votes <= 5) {
      color = '#E97E00';
    } else if (votes > 5 && votes <= 7) {
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
              : 'https://ukkistra.ru/local/templates/inteo_corporation/f/i/noimage.png'
          }
          placeholder={
            <Spin className="placeholder" size="large">
              <div className="placeholder_pos"></div>
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
                {votes.toFixed(1)}
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
              value={rating}
            />
          </Space>
        </Card.Grid>
      </Card>
    );
  }
}
