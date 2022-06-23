<template>
  <main class="flex">
    <div class="left-1">
      <vp-text-nav></vp-text-nav>
    </div>
    <div class="left-2">
      <vp-dots-nav></vp-dots-nav>
    </div>
    <div class="right">
      <vp-section v-for="n in 2" :key="n" :title="`Section ${n}`" target="#">
        <vp-panel v-for="n in 10" :key="n" :title="`Panel ${n}`" target="#">
          <h1>Panel {{ n }}</h1>
          <p>
            Cookie cheesecake candy sesame snaps halvah candy. Croissant cotton
            candy tootsie roll. Muffin topping brownie chocolate bar tart dragée
            cupcake. Candy canes apple pie jelly beans sweet sugar plum biscuit
            gingerbread. Chocolate cake dragée gummies caramels dragée sweet
            cotton candy cookie. Fruitcake soufflé lollipop cake marzipan
            cupcake. Candy canes toffee chocolate bar jelly-o ice cream. Jujubes
            cake sesame snaps muffin apple pie jujubes ice cream wafer ice
            cream. Chupa chups jelly-o marzipan donut candy canes soufflé sesame
            snaps. Topping apple pie lollipop tootsie roll apple pie gummies
            carrot cake cake pudding. Jelly beans biscuit gummi bears sweet
            gingerbread donut tiramisu. Dragée cookie liquorice macaroon
            chocolate bar cupcake sugar plum cotton candy. Tootsie roll pie
            dragée. Tart biscuit carrot cake biscuit oat cake. Sesame snaps
            topping lemon drops macaroon toffee macaroon gummies muffin. Sugar
            plum tiramisu candy canes. Pastry chocolate cake jelly-o toffee.
            Dragée jelly beans dragée oat cake wafer tootsie roll topping
            liquorice apple pie. Sweet pudding macaroon danish. Biscuit cupcake
            topping jelly beans bear claw cotton candy powder candy. Tiramisu
            carrot cake candy pie. Chocolate croissant oat cake bonbon powder
            macaroon. Cheesecake powder cupcake pastry dragée. Tootsie roll
            topping cake caramels tiramisu chocolate cake dragée. Caramels
            caramels chupa chups ice cream carrot cake soufflé. Candy jelly
            beans topping sweet roll. Gingerbread chupa chups candy chocolate
            pie macaroon toffee lollipop.
          </p>
        </vp-panel>
      </vp-section>
    </div>
    <vp-next text="Next"></vp-next>
  </main>
</template>

<script>
export default {};
</script>

<style>
.flex {
  display: flex;
}
.left-1 {
  width: 20%;
  position: sticky;
  top: 10px;
  height: 75vh;
}
.left-2 {
  width: 10%;
  position: sticky;
  top: 10px;
  height: 75vh;
}
.right {
  width: 70%;
}
.vp--next {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 25px;
}
.right .vp--panel {
  height: 100vh;
}
.vp--dot.vp--panel a {
  width: 10px;
  height: 10px;
  display: inline-block;
  background-color: #000;
}
.vp--dot.vp--panel.active a {
  background-color: #666;
}
</style>
