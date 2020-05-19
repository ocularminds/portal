const express = require('express');
const {insertAd, getAds, getAd} = require('./ad.service');
const {deleteAd, updateAd} = require('./ad.service');

const AdRoutes = express.Router();
AdRoutes.get('/', async (req, res) => {
  res.send(await getAds());
});
AdRoutes.get('/:id', async (req, res) => {
    const id = req.params.id;
  res.send(await getAd(id));
});
AdRoutes.post('/', async (req, res) => {
  const newAd = req.body;
  await insertAd(newAd);
  res.send({message: 'New ad inserted.'});
});

// endpoint to delete an ad
AdRoutes.delete('/:id', async (req, res) => {
  await deleteAd(req.params.id);
  res.send({message: 'Ad removed.'});
});

// endpoint to update an ad
AdRoutes.put('/:id', async (req, res) => {
  const updatedAd = req.body;
  await updateAd(req.params.id, updatedAd);
  res.send({message: 'Ad updated.'});
});

module.exports = AdRoutes;
