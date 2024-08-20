<script setup lang="ts"></script>

<template>
  <div class="card comment-display">
    <div class="comment-header">
      <slot name="header"></slot>
    </div>

    <div class="comment-rating">
      <slot name="aside-left"></slot>
    </div>

    <div class="comment-body">
      <slot></slot>
    </div>

    <div class="comment-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment-display {
  display: grid;
  grid-template-rows: auto;
  gap: 20px;
  grid-template-areas:
    'heading heading'
    'body body'
    'rating actions';

  .comment-header {
    grid-area: heading;
  }
  .comment-body {
    grid-area: body;
  }
  .comment-rating {
    grid-area: rating;
    place-self: start;
  }
  .comment-actions {
    grid-area: actions;
    justify-self: end;
  }

  &.is-editing {
    @media screen and (max-width: $bp-medium - 1) {
      .comment-rating,
      .comment-actions {
        display: none;
      }
    }
  }

  @include medium-screen {
    grid-template-columns: 40px auto min-content;
    grid-template-areas:
      'rating heading heading actions'
      'rating body body body';
  }
}
</style>
