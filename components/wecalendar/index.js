import dayjs from 'dayjs'
import relativeTime from "../../utils/dayjs/plugin/relativeTime"
import "../../utils/dayjs/locale/zh-cn"

dayjs.extend(relativeTime)
dayjs.locale("zh-cn")

const weekdaysShort = [
  '日',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
];

Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    view: {
      typ: String,
      value: 'week',
    },
    markCalendarList: {
      type: Array,
      value: [],
    },
    isToday: {
      type: Boolean,
      value: false
    },
    defaultDate: {
      type: String,
      value: null
    },
    showFolding: {
      type: Boolean,
      value: true
    },
    weekLayer: {
      type: Number,
      value: 1
    }
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
    created: function () {
    },
    ready: function () {
      let animation = wx.createAnimation({
        duration: 230,
        delay: 0
      }),
        that = this,
        friendlyTime = "",
        value = that.data.defaultDate ? dayjs(that.data.defaultDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        MonthRange = that.data.defaultDate ? dayjs(that.data.defaultDate) : dayjs(),
        today = that.data.today

      if (today === value) {
        friendlyTime = "今天"
      } else {
        friendlyTime = dayjs(value).fromNow()
      }

      that.setData({
        animation: animation.export(),
        MonthRange: MonthRange,
        value: value,
        friendlyTime: friendlyTime,
      }, () => {
        that.generationCalendar()
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    friendlyTime: "",
    today: dayjs().format('YYYY-MM-DD'),
    MonthRange: dayjs(),
    MonthText: dayjs().format('YYYY年MM月'),
    value: dayjs().format('YYYY-MM-DD'),
    calendar: [],
    calendarGroups: [],
    weekdaysShort: weekdaysShort,
    isFold: true,
    showFolding: true,
    weekLayer: 1,
    animation: {},
  },
  observers: {
    'MonthRange': function (MonthRange) {
      this.setData({
        MonthText: MonthRange.format('YYYY年MM月')
      })
    },
    'value': function (value) {
      this.setData({
        MonthText: dayjs(value).format('YYYY年MM月')
      })
    },
    'calendarGroups': function (calendarGroups) {
      if (this.data.isFold && calendarGroups) {
        const month = dayjs(calendarGroups[0].date).month()
        this.setData({
          MonthRange: this.data.MonthRange.month(month)
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    generationCalendar() {
      let that = this
      const { MonthRange } = that.data
      // 当前月份的天数
      const daysInMonth = MonthRange.daysInMonth();
      // 当前月份1日是周几
      const firstDayOfMonth = MonthRange.startOf('month').format('d');
      // 当前月份最后一天是周几
      const endDayOfMonth = MonthRange.endOf('month').format('d');

      const firstDay = MonthRange.startOf('month');
      const endDay = MonthRange.endOf('month');
      const calendar = [];

      // 处理上月
      for (let i = 0; i < Number(firstDayOfMonth); i++) {
        const date = firstDay.subtract(i + 1, 'days').format('YYYY-MM-DD');
        calendar.unshift({
          date,
          isCurrent: 0,
        });
      }

      // 处理本月
      for (let i = 0; i < daysInMonth; i++) {
        const date = MonthRange.date(i + 1).format('YYYY-MM-DD');

        calendar.push({
          date,
          isCurrent: 1,
        });
      }

      // 补齐最后一周
      for (let i = 0; i < 6 - Number(endDayOfMonth); i++) {
        const date = endDay.add(i + 1, 'days').format('YYYY-MM-DD');
        calendar.push({
          date,
          isCurrent: 0,
        });
      }

      that.setData({
        calendar,
      }, () => that.generationWeek())
    },
    generationWeek(type) {
      let that = this
      const { value, weekLayer, today} = that.data
      const len = 7 * weekLayer
      let newWeekSameDay = value
      // 处理周日历
      let groups = [];
      if (type === 'next') {
        let currentDate = dayjs(value),
            dayOfWeek = currentDate.day(),
            nextWeekSameDay = currentDate.add(7, 'day'),
            weekStart = nextWeekSameDay.subtract(dayOfWeek, 'day')
        newWeekSameDay = nextWeekSameDay.format('YYYY-MM-DD')
        for (let i = 0; i < len; i++) {
          groups.push({
            date: weekStart.add(i, 'day').format('YYYY-MM-DD'),
            isCurrent: 1,
          })
        }
      } else if (type === 'prev') {
        let currentDate = dayjs(value),
            dayOfWeek = currentDate.day(),
            nextWeekSameDay = currentDate.add(-7, 'day'),
            weekStart = nextWeekSameDay.subtract(dayOfWeek, 'day')
        newWeekSameDay = nextWeekSameDay.format('YYYY-MM-DD')
        for (let i = 0; i < len; i++) {
          groups.push({
            date: weekStart.add(i, 'day').format('YYYY-MM-DD'),
            isCurrent: 1,
          })
        }
      } else {
        let current = dayjs(value).startOf('week');
        if (current.day() !== 0) {
          current = current.subtract(current.day(), 'day');
        }
        for (let i = 0; i < len; i++) {
          groups.push({
            date: current.format('YYYY-MM-DD'),
            isCurrent: 1,
          })
          current = current.add(1, 'day')
        }
      }
      that.setData({
        calendarGroups: groups,
        value: newWeekSameDay,
        friendlyTime: today === newWeekSameDay ? '今天': dayjs().from(dayjs(newWeekSameDay))
      }, () => {
        that.getRangeDate()
        that.handleMarkCalendarList()
      })
    },
    getRangeDate() {
      let that = this
      const { isFold, calendar, calendarGroups } = that.data
      const beginTime = isFold ? calendarGroups[0].date : calendar[0].date,
          endTime = isFold ? calendarGroups[calendarGroups.length - 1].date : calendar[calendar.length - 1].date

      that.triggerEvent('onRangeDate', { beginTime, endTime });
    },
    handleMarkCalendarList() {
      let that = this
      const { calendar, calendarGroups, markCalendarList } = that.data
      this.setData({
        calendar: calendar.map(item => ({
          ...item,
          pointColor: markCalendarList.find(it => item.date === it.date)?.pointColor
        })),
        calendarGroups: calendarGroups.map(item => ({
          ...item,
          pointColor: markCalendarList.find(it => item.date === it.date)?.pointColor
        })),
      })
    },
    onCheck(e) {
      const { item } = e.currentTarget.dataset
      const { date } = item
      let that = this,
          today = that.data.today
      that.setData({
        value: date,
        friendlyTime: today === date ? '今天': dayjs().from(dayjs(date))
      }, () => {
        that.triggerEvent('onSelect', {day: date})
      })
    },
    onFold() {
      let that = this
      that.setData({
        isFold: !this.data.isFold
      }, () => {
        that.generationCalendar()
      })
    },
    onNext() {
      let that = this
      const { MonthRange, isFold } = that.data
      if (!isFold) {
        that.setData({
          MonthRange: MonthRange.add(1, isFold ? 'week' : 'month'),
        }, () => {
          that.generationCalendar()
        })
      }
      that.generationWeek('next');
      that.onAnimation()
    },
    onPrev() {
      let that = this
      const { MonthRange, isFold } = that.data
      if (!isFold) {
        that.setData({
          MonthRange: MonthRange.subtract(1, isFold ? 'week' : 'month'),
        }, () => {
          that.generationCalendar()
        })
      }
      that.generationWeek('prev');
      that.onAnimation()
    },
    onSlide(e) {
      let that = this
      console.log('onSlide', e.detail)
      switch (e.detail) {
        case 'R':
          that.onPrev()
          break;
        case 'L':
          that.onNext()
          break;
        case 'U':
          that.onFold()
          break
        case 'D':
          that.onFold()
          break;
        default:
          break;
      }
    },
    onAnimation() {
      let animation = wx.createAnimation({
        duration: 320,
        timingFunction: 'step-start',
        delay: 0
      }),
          that = this
      animation.opacity(0.3).step()
      animation.opacity(1).step();
      that.setData({
        animation: animation.export(),
      });
    },
    onToToday () {
      let that = this
      that.setData({
        value: dayjs().format('YYYY-MM-DD'),
        MonthRange: dayjs()
      }, () => {
        that.generationCalendar()
        that.triggerEvent('onSelect', {day: dayjs().format('YYYY-MM-DD')})
      })
    }
  }
})
