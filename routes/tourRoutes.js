const express = require('express');
const tourControllers = require('./../controllers/tourController')
const router = express.Router();
const authController = require('./../controllers/authController')
// router.param('id',tourControllers.checkId);
router
    .route('/top-5-cheap')
    .get(tourControllers.aliasTopTours,tourControllers.getAllTours)
router.route('/tour-stats').get(tourControllers.getToursStats)
router.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlan)
router
    .route('/')
        .get(authController.protect, tourControllers.getAllTours)
        .post(tourControllers.createTour);

router
    .route('/:id')
        .get(tourControllers.getTour)  
        .patch(tourControllers.updateTour)
        .delete(
            authController.protect,
            authController.restrictTo('admin','lead-guide'),
            tourControllers.deleteTour
        );
module.exports = router;