public class Paging
{
	public static void main(String[] args)
	{
		//分页的sql语句
		String sql = "select * from (select id,name,birthday,age,note,rownum rn from member where name like ? and rownum<?) temp where temp.rn>? ";
	}
}