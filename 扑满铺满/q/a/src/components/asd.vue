<template >
  <el-table class="tree-table" ref="treeGrid"
    :data="data" stripe
    border
            id="crTable"
    style="width: 100%"
    :row-style="showTr">
    <el-table-column type="selection" v-if="showCheckbox" checked="checked" prop='orgCode' width="55">
    </el-table-column>
    <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :width="column.width"
      :label="column.text" :type="column.type">
      <template slot-scope="scope" :class="{ 'tree-table-left': index === 0 }">
        <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
        <button style="border:0;background:transparent;outline:none;" class="button is-outlined is-primary is-small "
                v-if="toggleIconShow(index,scope.row)"
                @click="toggle(scope.$index, scope.row)">
          <i v-if="!scope.row._expanded" class="el-icon el-icon-arrow-right" aria-hidden="true"></i>
          <i v-if="scope.row._expanded" class="el-icon el-icon-arrow-right el-table__expand-icon--expanded" aria-hidden="true"></i>
        </button>
        <span v-else-if="index===0" class="ms-tree-space"></span>
        <!--{{ scope.row[column.dataIndex] }}-->
        {{ setColumnData(scope.row, column.dataIndex) }}
      </template>
    </el-table-column>
    <slot></slot>
  </el-table>
</template>
<script>
  import Utils from '../utils/index.js'
//  import Vue from 'vue'
  export default {
    name: 'tree-grid',
    props: {
      // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
      treeStructure: {
        type: Boolean,
        default: function() {
          return false
        }
      },
      // 这是相应的字段展示
      columns: {
        type: Array,
        default: function() {
          return []
        }
      },
      showCheckbox: {
        type: Boolean,
        default: function() {
          return false
        }
      },
      // 这是数据源
      dataSource: {
        type: Array,
        default: function() {
          return []
        }
      },
      // 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
      requestUrl: {
        type: String,
        default: function() {
          return ''
        }
      },
      // 这个是是否展示操作列
      treeType: {
        type: String,
        default: function() {
          return 'normal'
        }
      },
      // 是否默认展开所有树
      defaultExpandAll: {
        type: Boolean,
        default: function() {
          return true
        }
      }
    },
    data() {
      return {}
    },
    computed: {
    // 格式化数据源
      data: function() {
        let me = this
        if (me.treeStructure) {
          let data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
          //me.$refs.treeGrid.toggleRowSelection(data)
          //me.$refs.treeGrid.
            data.forEach((item, index) => {
             if(item.status === '1'){

             }
            })
          return data
        }

        return me.dataSource
      }
    },
    methods: {
      showTr: function(row, index) {
        return row.row._show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
      },
      toggle: function(trIndex, rowData) {
        let me = this
        let record = me.data[trIndex]
        record._expanded = !record._expanded
        this.data.map(item => {
          if (item.parentId === record.id) {
            item._show = record._expanded
            this.hide(item, record)
          }
        })
      },
      hide(item, record) {
        this.data.map(a => {
          if (a.parentId === item.id) {
            a._show = record._expanded
            this.hide(a, record)
          } else {
            return
          }
        })
      },
      // 显示层级关系的空格和图标
      spaceIconShow(index) {
        let me = this
        if (me.treeStructure && index === 0) {
          return true
        }
        return false
      },
      // 点击展开和关闭的时候，图标的切换
      toggleIconShow(index, record) {
        let me = this
        if (me.treeStructure && index === 0 && record.children && record.children.length > 0) {
          return true
        }
        return false
      },
      setColumnData(row, dataIndex) {
        let arr = dataIndex.split('.')
        let res = row
        arr.forEach((item) => {
          if (res) res = res[item]
        })
        return res || ''
      }
    }
  }
</script>
<style scoped>
  .ms-tree-space{position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;}
  .ms-tree-space::before{content: ""}
  table td{
    line-height: 26px;
  }
  .el-table__expand-icon--expanded {
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
  }
</style>
