<template>
  <div>
    <div class="tip">
      <h1>JSON to Model</h1>
      <h4>Paste your JSON in the textarea below, click convert and get your Dart classes for free.</h4>
    </div>
    <div class="flex file_name">
      <h4 sytle="flex-shrink:0">ClassName:</h4>
      <el-input
        class="file_name--input flex1"
        v-model="input"
        placeholder="Input Class Name"
      />
    </div>
    <div class="flex">
      <el-input
        type="textarea"
        placeholder="Input JSON Content"
        :autosize="{ minRows: 30, maxRows: 30 }"
        v-model="inputData"
      >
      </el-input>
      <div>
        <div class="translate_btn" @click="onTrans">
          <el-button type="primary"
            >Go<i
              :class="[
                'el-icon-arrow-right',
                isTrans ? 'el-icon-loading' : 'el-icon--right',
              ]"
            ></i
          ></el-button>
        </div>
        <div class="translate_btn" @click="copy">
          <el-button type="success"
            >Get<i class="el-icon-document-copy el-icon--right"></i
          ></el-button>
        </div>
      </div>
      <el-input
        id="output"
        type="textarea"
        :autosize="{ minRows: 30, maxRows: 30 }"
        v-model="outputData"
        class="output"
        readonly
      >
      </el-input>
    </div>
    
  </div>
</template>

<script>
import decode from "./Decode.ts";

export default {
  name: "HelloWorld1s",
  data() {
    return {
      input: "",
      inputData: "",
      outputData: "",
      isTrans: false,
    };
  },
  methods: {
    onTrans() {
      if (this.inputData.trim().length == 0) {
        return this.$message({
          message: "JSON Can't Empty",
          type: "error",
        });
      }
      this.isTrans = true;
      try {
        let value = JSON.parse(JSON.parse(JSON.stringify(this.inputData)));
        if (typeof value != "object") {
          return this.$message({
            message: "Class Name Can't Empty",
            type: "error",
          });
        }
        this.outputData = decode(value, this.input.trim().length == 0 ? 'auto' : this.input);
      } catch (err) {
        return this.$message({
          message: "JSON Is Not True",
          type: "error",
        });
      } finally {
        this.isTrans = false;
      }
    },
    copy() {
      if (this.outputData.trim().length == 0) {
        return this.$message({
          message: "Model Is Empty",
          type: "error",
        });
      }
      let copyText = document.getElementById("output");
      copyText.select();
      document.execCommand("copy");
      this.$message({
        message: "Copy Success",
        type: "success",
      });
    },
    getQueryString(name) {
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      let r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURI(r[2]);
      return '';
    },
  },
};
</script>
<style>
.flex {
  display: flex;
  align-items: center;
}
.flex1 {
  flex: 1;
}
.translate_btn {
  margin: 20px;
}
.file_name {
  margin-bottom: 30px;
  width: 400px;
}
.file_name--input {
  margin: 0 10px;
}
.el-textarea__inner {
  resize: none;
}
.el-textarea__inner{
  color: #2b2b2b!important;
  resize: none!important;
  outline: none!important;
  box-shadow: none !important;
}
.output .el-textarea__inner{
  border:node !important;
}

.tip{
  margin-bottom: 30px;
}

</style>