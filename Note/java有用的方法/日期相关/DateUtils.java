public class DateUtils
{

	private static final Calendar calendar = Calendar.getInstance();

	/**
	 * 获取指定年月的第一天的时间戳 yyyy-MM-dd 00:00:00,返回Date
	 * 	如果没有指定年,返回null;
	 * 	如果没有指定月,使用当前月.
	 * @return
	 */
	@SuppressWarnings("unused")
	private static Date getFirstDayTime(Integer year,Integer month){
		if(year!=null){
			if(month!=null){
				//获取指定月的数据
				//指定月份第一天 yyyy-MM-dd 00:00:00
				calendar.set(Calendar.YEAR, year);
				calendar.set(Calendar.MONTH, month-1);
				calendar.set(Calendar.DAY_OF_MONTH, 1);
				calendar.set(Calendar.HOUR_OF_DAY, 0);
				calendar.set(Calendar.MINUTE, 0);
				calendar.set(Calendar.SECOND, 0);
				return calendar.getTime();
			}else{
				//获取当前月的数据
				//指定月份第一天 yyyy-MM-dd 00:00:00
				calendar.setTime(new Date());
				calendar.set(Calendar.YEAR, year);
				calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH));
				calendar.set(Calendar.DAY_OF_MONTH, 1);
				calendar.set(Calendar.HOUR_OF_DAY, 0);
				calendar.set(Calendar.MINUTE, 0);
				calendar.set(Calendar.SECOND, 0);
				return calendar.getTime();
			}
		}
		return null;
	}
	
	
	/**
	 * 获取指定年月的最后一天的时间戳 yyyy-MM-dd 23:59:59,返回Date
	 * 	如果没有指定年,返回null;
	 * 	如果没有指定月,使用当前月.
	 * @param year
	 * @param month
	 * @return
	 */
	@SuppressWarnings("unused")
	private static Date getLastDayTime(Integer year,Integer month){
		if(year!=null){
			if(month!=null){
				//获取指定月的数据
				//指定月份最后一天 yyyy-MM-dd 23:59:59
				calendar.set(Calendar.YEAR, year);
				calendar.set(Calendar.MONTH, month-1);
				calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
				calendar.set(Calendar.HOUR_OF_DAY, 23);
				calendar.set(Calendar.MINUTE, 59);
				calendar.set(Calendar.SECOND, 59);
				return calendar.getTime();
			}else{
				//获取当前月的数据
				//当前月份最后一天 yyyy-MM-dd 23:59:59
				calendar.setTime(new Date());
				calendar.set(Calendar.YEAR, year);
				calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH));
				calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
				calendar.set(Calendar.HOUR_OF_DAY, 23);
				calendar.set(Calendar.MINUTE, 59);
				calendar.set(Calendar.SECOND, 59);
				return calendar.getTime();
			}
		}
		return null;
	}

	
	

}