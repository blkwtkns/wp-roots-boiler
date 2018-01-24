<!DOCTYPE html>
<html class="no-js" <?php language_attributes(); ?>>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <title><?php bloginfo('name'); ?>: <?php wp_title(); ?></title>
  <meta name="robots" content="index, follow">
  <meta name="description" content="">
  <meta name="keywords" content="">
  <meta http-equiv="content-language" content="en">

  <link rel="icon" href="favicon.ico">

  <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">

  <link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri().'/css/styles.css?v=1.0.1'; ?>">
  <link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>">

  <script src="https://cdnjs.cloudflare.com/ajax/libs/picturefill/3.0.0-beta1/picturefill.min.js"></script>

  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
  <?php include("template-parts/common/site-header.php"); ?>
