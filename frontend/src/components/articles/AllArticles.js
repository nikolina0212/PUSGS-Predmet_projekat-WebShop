import React from "react";
import Dashboard from "../shared/Dashboard";
import { useState, useEffect } from "react";
import { Card, Grid, CardMedia, CardContent, Typography, CardActions, Button, Container } from "@mui/material";
import { GetAllArticles } from "../../services/ArticleService";

function AllArticles(){
  const [articles, setArticles] = useState(null);
  const [articleAmounts, setArticleAmounts] = useState({});

  const getAllArticles = async () => {
    try {
      const resp = await GetAllArticles();
      setArticles(resp);
    } catch (error) {
      console.log(error.message);
    }
};

  useEffect(() => {
    getAllArticles();
  }, []);

  const handleIncreaseAmount = (articleId) => {
    setArticleAmounts((prevAmounts) => ({
      ...prevAmounts,
      [articleId]: (prevAmounts[articleId] || 0) + 1,
    }));
    setArticles((prevArticles) => {
      return prevArticles.map((article) => {
        if (article.id === articleId) {
          return {
            ...article,
            amount: article.amount - 1,
          };
        }
        return article;
      });
    });
  };

  const handleDecreaseAmount = (articleId) => {
    setArticleAmounts((prevAmounts) => ({
      ...prevAmounts,
      [articleId]: Math.max((prevAmounts[articleId] || 0) - 1, 0),
    }));
    setArticles((prevArticles) => {
      return prevArticles.map((article) => {
        if (article.id === articleId) {
          return {
            ...article,
            amount: article.amount + 1,
          };
        }
        return article;
      });
    });
  };

  return (
    <Dashboard content={
      <>
      {articles === null && (<h3>No available artiles</h3>)}
      {articles && (
      <Container sx={{ py: 8 }} maxWidth="md">
      <Grid container spacing={4}>
        {articles.map((article) => (
          <Grid item key={article.id} xs={12} sm={6} md={4}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardMedia
                    component="div"
                    sx={{
                      pt: '10.25%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <img
                        src={`https://localhost:44320/${article.image}`}
                        alt=""
                        style={{ width: '120px',height: '120px' }}
                      />
                  </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  <b>{article.name}</b>
                </Typography>
                <Typography>
                  {article.description}
                </Typography>
                <Typography>
                  <b>Price:</b> {article.price}
                </Typography>
                <Typography>
                  <b>Amount:</b> {article.amount}
                </Typography>
              </CardContent>
              <CardActions>
              <Button variant="outlined" color="error" disabled={!articleAmounts[article.id] || articleAmounts[article.id] === 0} size="small" onClick={() => handleDecreaseAmount(article.id)}>
                        -
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                        {articleAmounts[article.id] || 0}
                    </Typography>
                    <Button disabled={article.amount === 0} 
                    variant="outlined" color="success" size="small" onClick={() => handleIncreaseAmount(article.id)}>
                        +
                    </Button><br/>
                <Button  variant="outlined"  size="small">Add to cart</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      </Container>
            )}
      </>
    }/>
  );
}

export default AllArticles;